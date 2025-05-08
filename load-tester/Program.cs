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

        var combinedScenario = Scenario.Create("CombinedListingTest_50_50", async context =>
        {
            var stepIndex = context.InvocationNumber % 2;

            if (stepIndex == 0)
            {
                var request = Http.CreateRequest("GET", "https://localhost:7297/api/listing")
                    .WithHeader("Accept", "application/json");

                return await Http.Send(httpClient, request);
            }
            else
            {
                var id = 31094;
                var request = Http.CreateRequest("GET", $"https://localhost:7297/api/listing/{id}")
                    .WithHeader("Accept", "application/json");

                return await Http.Send(httpClient, request);
            }
        })
        .WithoutWarmUp()
        .WithLoadSimulations(
            Simulation.RampingInject(rate: 100, interval: TimeSpan.FromSeconds(1), during: TimeSpan.FromSeconds(30))
        );

        NBomberRunner
            .RegisterScenarios(combinedScenario)
            .WithWorkerPlugins(new HttpMetricsPlugin([HttpVersion.Version1]))
            .Run();
    }
}

