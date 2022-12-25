using Iglo.Cache;
using Iglo.Client;
using System.Text.Json;

namespace Iglo.RankingChart.DataDownloader
{
    public class Program
    {
        public static void Main()
        {
            var outputFilePath = @"C:\Users\pawel\source\repos\IGLO\data.json";
            var cacheFilePath = @"C:\Users\pawel\source\repos\fdafadf\IGLO.Client\IGLO.RankingChart.DataDownloader\Cache.zip";

            using (var fileCache = new ZipCache(cacheFilePath))
            {
                using (var client = new IgloCachedClient(new JsonFileCache(fileCache)))
                {
                    var data = new List<List<SeasonGroup>>();

                    foreach (var seasonNumber in Enumerable.Range(1, 18))
                    {
                        var season = new List<SeasonGroup>();

                        foreach (var group in client.GetGroups(seasonNumber))
                        {
                            var members = client.GetMembers(seasonNumber, group.Name);
                            var placements = members.Select((member, index) => new GroupPlacement() { Player = member.Player, Position = index });
                            season.Add(new SeasonGroup() { GroupLetter = group.Name, Placements = placements });
                        }

                        data.Add(season);
                    }

                    File.WriteAllText(outputFilePath, JsonSerializer.Serialize(data));
                }
            }
        }
    }
}
