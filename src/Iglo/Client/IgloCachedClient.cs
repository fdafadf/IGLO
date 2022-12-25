using Iglo.Cache;
using Iglo.Model;

namespace Iglo.Client
{
    public class IgloCachedClient : IDisposable
    {
        IgloClient Client;
        JsonFileCache Cache;

        public IgloCachedClient(JsonFileCache cache)
        {
            Client = new IgloClient();
            Cache = cache;
        }

        public Group[] GetGroups(int season)
        {
            return Cache.LoadObject($"season-{season}-groups.json", () => Client.GetGroups(season));
        }

        public Member[] GetMembers(int season, string group)
        {
            return Cache.LoadObject($"season-{season}-group-{group}-members.json", () => Client.GetMembers(season, group));
        }

        public Round[] GetRounds(int season, string group)
        {
            return Cache.LoadObject($"season-{season}-group-{group}-rounds.json", () => Client.GetRounds(season, group));
        }

        public Game[] GetGames(int season, string group, int round)
        {
            return Cache.LoadObject($"season-{season}-group-{group}-rounds-{round}-games.json", () => Client.GetGames(season, group, round));
        }

        public void Dispose()
        {
            Client.Dispose();
        }
    }
}