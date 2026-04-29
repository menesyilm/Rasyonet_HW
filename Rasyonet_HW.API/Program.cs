using Microsoft.EntityFrameworkCore;
using Rasyonet_HW.API.Data;
using Rasyonet_HW.API.Configuration;
using Rasyonet_HW.API.External;
using Rasyonet_HW.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
//AddDbContext configuration
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//Add Finnhub configuration and service
builder.Services.Configure<FinnhubOptions>(
    builder.Configuration.GetSection("Finnhub"));
builder.Services.AddHttpClient<FinnhubService>();
//Add repository to DI container
builder.Services.AddScoped<IStockRepository, StockRepository>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
