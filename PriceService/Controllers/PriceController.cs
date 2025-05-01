using Microsoft.AspNetCore.Mvc;

namespace PriceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriceController : ControllerBase
    {
        private static readonly Random _random = new Random();

        [HttpGet("{symbol}")]
        public IActionResult GetPrice(string symbol)
        {
            var price = Math.Round(80 + _random.NextDouble() * 40, 2); // simulate 80–120 range
            var response = new
            {
                symbol = symbol.ToUpper(),
                price,
                timestamp = DateTime.UtcNow
            };

            return Ok(response);
        }
    }
}
