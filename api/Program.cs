using api;
using api.Redis;
using api.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using StackExchange.Redis;

string AllowedOrigins = "AllowedOrigin";

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowedOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000");
        });
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddMiniProfiler(options => options.RouteBasePath = "/profiler").AddEntityFramework();
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<InsideAirbnetbDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("InsideAirbnetbDb")));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IListingRepository, ListingRepository>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = $"https://{builder.Configuration["Auth0:Domain"]}";
    options.Audience = builder.Configuration["Auth0:Audience"];

    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = $"{builder.Configuration["Auth0:Audience"]}/claims/roles"
    };
});


builder.Services.AddControllers();
builder.Services.AddOpenApi();
System.Diagnostics.Debug.WriteLine(builder.Configuration.GetConnectionString("Redis"));

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis")));

//builder.Services.AddStackExchangeRedisCache(options =>
//{
//    options.Configuration = builder.Configuration.GetConnectionString("Redis");
//});
builder.Services.AddScoped<RedisCacheService>();
builder.Services.AddScoped<RedisCacheSeeder>();

builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseMiniProfiler();

    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Inside Airbnetb API V1");
    });
}

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<RedisCacheSeeder>();
    await seeder.SeedAsync();
}

app.UseCors(AllowedOrigins);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
