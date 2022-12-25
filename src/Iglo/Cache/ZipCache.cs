using System.IO.Compression;

namespace Iglo.Cache
{
    public class ZipCache : ITextFileCache, IDisposable
    {
        Stream Stream;
        ZipArchive Archive;

        public ZipCache(string path)
        {
            Stream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
            Archive = new ZipArchive(Stream, ZipArchiveMode.Update);
        }

        public string LoadFile(string fileName, Func<string> loader)
        {
            var entry = Archive.GetEntry(fileName);

            if (entry == null)
            {
                var content = loader();
                entry = Archive.CreateEntry(fileName, CompressionLevel.Fastest);

                using (StreamWriter writer = new StreamWriter(entry.Open()))
                {
                    writer.Write(content);
                }

                return content;
            }
            else
            {
                using (var entryStream = entry.Open())
                {
                    using (var entryReader = new StreamReader(entryStream))
                    {
                        return entryReader.ReadToEnd();
                    }
                }
            }
        }

        public void Dispose()
        {
            Archive?.Dispose();
            Stream?.Dispose();
        }
    }
}