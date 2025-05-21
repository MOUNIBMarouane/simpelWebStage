import {
  CheckCircle,
  FileText,
  MessageSquare,
  Settings,
  UsersRound,
  UserRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ApprovalGroupFormData } from "@/models/approval";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ReviewStepProps {
  formData: ApprovalGroupFormData;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  // Format rule type for display
  const formatRuleType = (ruleType: string) => {
    switch (ruleType) {
      case "All":
        return "All Must Approve";
      case "Any":
        return "Any Can Approve";
      case "Sequential":
        return "Sequential Approval";
      default:
        return ruleType;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Review Details</h3>
        <p className="text-sm text-muted-foreground">
          Review the approval group information before creating
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Group Name</h4>
                <p className="text-sm">{formData.name}</p>
              </div>
            </div>

            {formData.comment && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 flex-shrink-0 mt-0.5">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.comment}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 flex-shrink-0 mt-0.5">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Approval Method</h4>
                <Badge variant="secondary" className="font-normal">
                  {formatRuleType(formData.ruleType)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 flex-shrink-0 mt-0.5">
                <UsersRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Group Members</h4>
                  <Badge variant="outline" className="ml-2">
                    {formData.selectedUsers.length}{" "}
                    {formData.selectedUsers.length === 1 ? "user" : "users"}
                  </Badge>
                </div>

                {formData.selectedUsers.length > 0 ? (
                  <ScrollArea className="h-[150px] w-full">
                    <div className="space-y-2 pr-4">
                      {formData.selectedUsers.map((user) => (
                        <div
                          key={user.userId}
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                        >
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <UserRound className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {user.username}
                            </p>
                            {user.role && (
                              <p className="text-xs text-muted-foreground truncate">
                                {user.role}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No users selected. Please go back and select users.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-start gap-3 p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">
              Ready to create approval group
            </p>
            <p className="text-sm mt-1">
              Click "Create Group" to finish and create this approval group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
