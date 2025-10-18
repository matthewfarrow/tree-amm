// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ForestTreeAMM
 * @notice A nature-inspired Automated Market Maker using the constant product formula (x * y = k)
 * @dev Like a forest ecosystem maintaining balance, this AMM keeps token reserves in equilibrium
 * 
 * 🌲 Forest Tree AMM - Where liquidity grows like ancient trees 🌲
 * 
 * Features:
 * - Constant product formula (rootReserveA * rootReserveB = k)
 * - 0.3% swap fee (like nutrients flowing through the forest)
 * - Add/Remove liquidity (planting and harvesting)
 * - LP tokens representing your stake in the forest
 * 
 * Security: Always audit before mainnet deployment!
 */
contract ForestTreeAMM is ERC20, ReentrancyGuard, Ownable {
    
    // 🌳 The two token roots that anchor our forest pool
    IERC20 public immutable tokenSaplingA;  // First token (like oak)
    IERC20 public immutable tokenSaplingB;  // Second token (like pine)
    
    // 🌲 Like roots anchoring a tree, reserves maintain the pool balance
    uint256 public rootReserveA;  // Reserve of token A
    uint256 public rootReserveB;  // Reserve of token B
    
    // 🍃 Fee configuration (0.3% = 30 basis points, like Uniswap V2)
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant SWAP_FEE = 30; // 0.3%
    
    // 🌱 Minimum liquidity locked forever (prevents division by zero)
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    
    // 📊 Events - tracking the forest's growth
    event LiquidityPlanted(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    
    event LiquidityHarvested(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    
    event TokensSwapped(
        address indexed trader,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    
    event ReservesUpdated(uint256 rootReserveA, uint256 rootReserveB);
    
    /**
     * @notice Plant the first seeds of the forest (initialize the AMM)
     * @param _tokenA Address of first ERC-20 token
     * @param _tokenB Address of second ERC-20 token
     */
    constructor(
        address _tokenA,
        address _tokenB
    ) ERC20("Forest Tree LP", "FOREST-LP") Ownable(msg.sender) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token addresses");
        require(_tokenA != _tokenB, "Tokens must be different");
        
        tokenSaplingA = IERC20(_tokenA);
        tokenSaplingB = IERC20(_tokenB);
    }
    
    /**
     * @notice 🌱 Plant liquidity into the forest (add liquidity to the pool)
     * @dev First liquidity provider sets the initial price ratio
     * @param amountADesired Amount of token A to add
     * @param amountBDesired Amount of token B to add
     * @param amountAMin Minimum amount of token A (slippage protection)
     * @param amountBMin Minimum amount of token B (slippage protection)
     * @return amountA Actual amount of token A added
     * @return amountB Actual amount of token B added
     * @return liquidity LP tokens minted
     */
    function plantLiquidity(
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) external nonReentrant returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(amountADesired > 0 && amountBDesired > 0, "Amounts must be greater than 0");
        
        // Calculate optimal amounts based on current reserves
        if (rootReserveA == 0 && rootReserveB == 0) {
            // First liquidity provider sets the initial ratio
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            // Maintain the current ratio
            uint256 amountBOptimal = quote(amountADesired, rootReserveA, rootReserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "Insufficient B amount");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = quote(amountBDesired, rootReserveB, rootReserveA);
                require(amountAOptimal <= amountADesired && amountAOptimal >= amountAMin, "Insufficient A amount");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
        
        // Transfer tokens from provider to the forest
        tokenSaplingA.transferFrom(msg.sender, address(this), amountA);
        tokenSaplingB.transferFrom(msg.sender, address(this), amountB);
        
        // Calculate and mint LP tokens (like planting certificates)
        liquidity = _mintLiquidity(amountA, amountB);
        
        // Update reserves
        _updateReserves();
        
        emit LiquidityPlanted(msg.sender, amountA, amountB, liquidity);
    }
    
    /**
     * @notice 🍂 Harvest your liquidity from the forest (remove liquidity)
     * @param liquidity Amount of LP tokens to burn
     * @param amountAMin Minimum amount of token A to receive
     * @param amountBMin Minimum amount of token B to receive
     * @return amountA Amount of token A received
     * @return amountB Amount of token B received
     */
    function harvestLiquidity(
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");
        
        uint256 totalSupply = totalSupply();
        
        // Calculate proportional amounts (like harvesting fruit from your trees)
        amountA = (liquidity * rootReserveA) / totalSupply;
        amountB = (liquidity * rootReserveB) / totalSupply;
        
        require(amountA >= amountAMin, "Insufficient A amount");
        require(amountB >= amountBMin, "Insufficient B amount");
        
        // Burn LP tokens
        _burn(msg.sender, liquidity);
        
        // Transfer tokens back to provider
        tokenSaplingA.transfer(msg.sender, amountA);
        tokenSaplingB.transfer(msg.sender, amountB);
        
        // Update reserves
        _updateReserves();
        
        emit LiquidityHarvested(msg.sender, amountA, amountB, liquidity);
    }
    
    /**
     * @notice 🔄 Swap tokens through the forest (token exchange)
     * @param tokenIn Address of token to swap from
     * @param amountIn Amount of tokens to swap
     * @param amountOutMin Minimum amount of tokens to receive (slippage protection)
     * @return amountOut Amount of tokens received
     */
    function swapTokens(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");
        require(
            tokenIn == address(tokenSaplingA) || tokenIn == address(tokenSaplingB),
            "Invalid token"
        );
        
        bool isTokenA = tokenIn == address(tokenSaplingA);
        (IERC20 tokenSwapIn, IERC20 tokenSwapOut, uint256 reserveIn, uint256 reserveOut) = isTokenA
            ? (tokenSaplingA, tokenSaplingB, rootReserveA, rootReserveB)
            : (tokenSaplingB, tokenSaplingA, rootReserveB, rootReserveA);
        
        // Transfer tokens in
        tokenSwapIn.transferFrom(msg.sender, address(this), amountIn);
        
        // Calculate output amount with 0.3% fee (like the forest taking nutrients)
        amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "Insufficient output amount");
        require(amountOut < reserveOut, "Insufficient liquidity");
        
        // Transfer tokens out
        tokenSwapOut.transfer(msg.sender, amountOut);
        
        // Update reserves
        _updateReserves();
        
        emit TokensSwapped(
            msg.sender,
            tokenIn,
            address(tokenSwapOut),
            amountIn,
            amountOut
        );
    }
    
    /**
     * @notice Calculate output amount for a given input (constant product formula)
     * @dev Like calculating how nutrients flow through the forest
     * Formula: amountOut = (amountIn * 0.997 * reserveOut) / (reserveIn + amountIn * 0.997)
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "Insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        // Apply 0.3% fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - SWAP_FEE);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        amountOut = numerator / denominator;
    }
    
    /**
     * @notice Calculate required input amount for a desired output
     * @dev Reverse calculation for exact output swaps
     */
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountIn) {
        require(amountOut > 0, "Insufficient output amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        uint256 numerator = reserveIn * amountOut * FEE_DENOMINATOR;
        uint256 denominator = (reserveOut - amountOut) * (FEE_DENOMINATOR - SWAP_FEE);
        amountIn = (numerator / denominator) + 1;
    }
    
    /**
     * @notice Quote amount B for a given amount A (for adding liquidity)
     * @dev Like calculating how many seeds you need to maintain forest balance
     */
    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) public pure returns (uint256 amountB) {
        require(amountA > 0, "Insufficient amount");
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");
        amountB = (amountA * reserveB) / reserveA;
    }
    
    /**
     * @notice Get current reserves
     * @return _reserveA Reserve of token A
     * @return _reserveB Reserve of token B
     */
    function getReserves() external view returns (uint256 _reserveA, uint256 _reserveB) {
        _reserveA = rootReserveA;
        _reserveB = rootReserveB;
    }
    
    /**
     * @dev Internal function to mint LP tokens
     */
    function _mintLiquidity(uint256 amountA, uint256 amountB) private returns (uint256 liquidity) {
        uint256 totalSupply = totalSupply();
        
        if (totalSupply == 0) {
            // First liquidity provider
            // Mint initial liquidity based on geometric mean
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(1), MINIMUM_LIQUIDITY); // Lock minimum liquidity forever
        } else {
            // Subsequent liquidity providers
            // Mint proportional to existing liquidity
            liquidity = min(
                (amountA * totalSupply) / rootReserveA,
                (amountB * totalSupply) / rootReserveB
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        _mint(msg.sender, liquidity);
    }
    
    /**
     * @dev Update reserves to match current balances
     */
    function _updateReserves() private {
        rootReserveA = tokenSaplingA.balanceOf(address(this));
        rootReserveB = tokenSaplingB.balanceOf(address(this));
        emit ReservesUpdated(rootReserveA, rootReserveB);
    }
    
    /**
     * @dev Babylonian method for square root
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    
    /**
     * @dev Return minimum of two numbers
     */
    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x < y ? x : y;
    }
}
