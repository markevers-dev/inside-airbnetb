using NBomber.CSharp;
using NBomber.Http;
using NBomber.Http.CSharp;

class Program
{
#pragma warning disable IDE0060 // Remove unused parameter
    static void Main(string[] args)
#pragma warning restore IDE0060 // Remove unused parameter
    {
        using var httpClient = new HttpClient();

        var listingsScenario = Scenario.Create("Listings Test", async context =>
        {
            var pageNumber = Random.Shared.Next(1, 50);
            var request = Http.CreateRequest("GET", $"https://localhost:7297/api/listing?pageNumber={pageNumber}&pageSize=25000")
                    .WithHeader("Accept", "application/json");

            return await Http.Send(httpClient, request);
        })
        .WithoutWarmUp()
        .WithLoadSimulations(
            Simulation.RampingInject(rate: 100, interval: TimeSpan.FromSeconds(1), during: TimeSpan.FromSeconds(30))
        );

        var detailedScenario = Scenario.Create("Detailed Test", async context =>
        {
            var id = 31094;
            var request = Http.CreateRequest("GET", $"https://localhost:7297/api/listing/{id}")
                .WithHeader("Accept", "application/json");
            return await Http.Send(httpClient, request);
        })
        .WithoutWarmUp()
        .WithLoadSimulations(
            Simulation.RampingInject(rate: 100, interval: TimeSpan.FromSeconds(1), during: TimeSpan.FromSeconds(30))
        );

        NBomberRunner
            .RegisterScenarios(listingsScenario)
            .WithWorkerPlugins(new HttpMetricsPlugin([HttpVersion.Version1]))
            .Run();

        NBomberRunner
            .RegisterScenarios(detailedScenario)
            .WithWorkerPlugins(new HttpMetricsPlugin([HttpVersion.Version1]))
            .Run();
    }
}

