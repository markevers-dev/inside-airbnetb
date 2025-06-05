using api;
using api.Repositories;
using Microsoft.EntityFrameworkCore;

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

builder.Services.AddControllers();
builder.Services.AddOpenApi();

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

app.UseCors(AllowedOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
