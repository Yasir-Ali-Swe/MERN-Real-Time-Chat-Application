import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col bg-background border">
      <div className="flex h-14 items-center border-b px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${id || "user"}`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="font-semibold">User {id}</div>
      </div>
      <div className="hidden h-14 items-center border-b px-4 lg:flex">
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${id || "user"}`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="font-semibold">User {id}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
        <div className="text-center text-muted-foreground mt-4 mb-auto">
          Chat content for User {id} will appear here.
        </div>
      </div>

      <div className="border-t p-3 flex items-center gap-2">
        <Input placeholder="Type a message..." className="flex-1" />
        <Button size="icon">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
