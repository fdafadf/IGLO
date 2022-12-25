using System.Text.Json;

namespace Iglo.Cache
{
    public class JsonFileCache
    {
        ITextFileCache FileCache;

        public JsonFileCache(ITextFileCache fileCache)
        {
            FileCache = fileCache;
        }

        public T LoadObject<T>(string fileName, Func<T> loader)
        {
            return JsonSerializer.Deserialize<T>(FileCache.LoadFile(fileName, () => JsonSerializer.Serialize(loader())));
        }
    }
}