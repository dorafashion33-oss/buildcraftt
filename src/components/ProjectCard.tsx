import { Star, MoreVertical } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    prompt: string;
    generated_code: string;
    created_at: string;
  };
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/80 transition-all duration-200 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] bg-muted/30 relative overflow-hidden">
        <iframe
          srcDoc={project.generated_code}
          className="w-[200%] h-[200%] border-0 pointer-events-none origin-top-left scale-50"
          sandbox=""
          title={project.prompt}
          tabIndex={-1}
        />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-background">
            <Star className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-background">
            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate">{project.prompt.slice(0, 50)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Edited {format(new Date(project.created_at), "MMM d, yyyy")}
        </p>
      </div>
    </button>
  );
};

export default ProjectCard;
