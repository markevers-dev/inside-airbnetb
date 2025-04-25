using NBomber.CSharp;
using NBomber.Http;
using NBomber.Http.CSharp;

class Program
{
    static void Main(string[] args)
    {
        using var httpClient = new HttpClient();

        var scenario = Scenario.Create("NBomberLoadTester", async context =>
        {
            var request = Http.CreateRequest("GET", "https://localhost:7297/listings")
            .WithHeader("Accept", "text/html");

            var response = await Http.Send(httpClient, request);
            System.Diagnostics.Debug.WriteLine($"Response status: {response}");
            return response;
        })

        .WithoutWarmUp()
        .WithLoadSimulations(
            //Simulation.RampingInject(rate: 1000,
            //                         interval: TimeSpan.FromSeconds(1),
            //                         during: TimeSpan.FromSeconds(30))
            Simulation.Inject(rate: 10,
                              interval: TimeSpan.FromSeconds(1),
                              during: TimeSpan.FromSeconds(30))

        //Simulation.RampingInject(rate: 5000,
        //                        interval: TimeSpan.FromSeconds(1),
        //                        during: TimeSpan.FromSeconds(10)),
        //Simulation.Inject(rate: 1000,
        //interval: TimeSpan.FromSeconds(1),
        //during: TimeSpan.FromSeconds(10))
        );

        NBomberRunner
            .RegisterScenarios(scenario)
            .WithWorkerPlugins(new HttpMetricsPlugin([HttpVersion.Version1]))
            .Run();
    }
}

