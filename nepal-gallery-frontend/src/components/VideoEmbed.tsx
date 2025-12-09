
interface VideoEmbedProps {
  embedCode: string;
  title: string;
}

const VideoEmbed = ({ embedCode, title }: VideoEmbedProps) => {
  // This function safely converts the HTML string (<iframe>) into real HTML
  const createMarkup = () => {
    return { __html: embedCode };
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg my-4">
      <div className="p-2 bg-gray-800">
        <h3 className="text-white font-bold text-sm truncate">{title}</h3>
      </div>
      {/* The Magic Container for Responsive Video */}
      <div 
        className="relative w-full" 
        style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
          dangerouslySetInnerHTML={createMarkup()} 
        />
      </div>
    </div>
  );
};

export default VideoEmbed;