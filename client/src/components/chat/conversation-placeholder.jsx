import { Card, CardContent } from "@/components/ui/card";
import { MessageCirclePlus } from "lucide-react";

export default function ConversationPlaceholder() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="flex flex-col items-center justify-center gap-4 p-6 border-none  shadow-none">
        <MessageCirclePlus className="h-12 w-12 text-muted-foreground" />
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            No conversation selected
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please select a conversation to start chatting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
