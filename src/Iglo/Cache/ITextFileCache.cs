namespace Iglo.Cache
{
    public interface ITextFileCache
    {
        string LoadFile(string fileName, Func<string> loader);
    }
}