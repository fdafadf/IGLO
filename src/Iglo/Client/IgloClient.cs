using System.Text.Json;
using Iglo.Model;

namespace Iglo.Client
{
    public class IgloClient : IDisposable
    {
        public const string DefaultHost = "iglo.szalenisamuraje.org";

        string Host = DefaultHost;
        HttpClient Client;

        public IgloClient()
        {
            Client = new HttpClient();
        }

        public void Dispose()
        {
            Client.Dispose();
        }

        public Group[] GetGroups(int season)
        {
            return DownloadPage<Group>($"https://{Host}/api/seasons/{season}/groups?format=json");
        }

        public Member[] GetMembers(int season, string group)
        {
            return DownloadPage<Member>($"https://{Host}/api/seasons/{season}/groups/{group}/members?format=json");
        }

        public Round[] GetRounds(int season, string group)
        {
            return DownloadPage<Round>($"https://{Host}/api/seasons/{season}/groups/{group}/rounds?format=json");
        }

        public Game[] GetGames(int season, string group, int round)
        {
            return DownloadPage<Game>($"https://{Host}/api/seasons/{season}/groups/{group}/rounds/{round}/games?format=json");
        }

        public string Download(string url)
        {
            return Client.GetStringAsync(url).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public T[] DownloadPage<T>(string url)
        {
            return JsonSerializer.Deserialize<Page<T>>(Download(url), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true }).Results;
        }
    }
}