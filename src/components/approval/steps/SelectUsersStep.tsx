import { useState, useEffect } from "react";
import { Check, Search, Users, X, UserRound, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApproverInfo } from "@/models/approval";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface SelectUsersStepProps {
  availableUsers: ApproverInfo[];
  selectedUsers: ApproverInfo[];
  isLoading: boolean;
  onSelectedUsersChange: (users: ApproverInfo[]) => void;
}

export function SelectUsersStep({
  availableUsers,
  selectedUsers,
  isLoading,
  onSelectedUsersChange,
}: SelectUsersStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<ApproverInfo[]>([]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(availableUsers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = availableUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, availableUsers]);

  const handleToggleUser = (user: ApproverInfo) => {
    const isSelected = selectedUsers.some((u) => u.userId === user.userId);

    if (isSelected) {
      // Remove user
      onSelectedUsersChange(
        selectedUsers.filter((u) => u.userId !== user.userId)
      );
    } else {
      // Add user
      onSelectedUsersChange([...selectedUsers, user]);
    }
  };

  const isUserSelected = (userId: number) => {
    return selectedUsers.some((user) => user.userId === userId);
  };

  const handleRemoveSelectedUser = (userId: number) => {
    onSelectedUsersChange(
      selectedUsers.filter((user) => user.userId !== userId)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Users</h3>
        <p className="text-sm text-muted-foreground">
          Choose users who will be part of this approval group
        </p>
      </div>

      {/* Selected Users */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <UserRound className="h-4 w-4 text-blue-500" />
          Selected Users ({selectedUsers.length})
        </Label>
        <div className="border rounded-md p-2 min-h-[60px] bg-muted/30">
          {selectedUsers.length === 0 ? (
            <div className="flex items-center justify-center h-[40px] text-sm text-muted-foreground">
              No users selected yet
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <Badge
                  key={user.userId}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2 pr-1 py-1"
                >
                  <span>{user.username}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full p-0 hover:bg-muted"
                    onClick={() => handleRemoveSelectedUser(user.userId)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Available Users
          </Label>
          <div className="relative w-[220px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="border rounded-md">
          <ScrollArea className="h-[260px] rounded-md">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                {searchQuery.trim() !== "" ? (
                  <>
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>No users found matching "{searchQuery}"</p>
                    <Button
                      variant="link"
                      onClick={() => setSearchQuery("")}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <Users className="h-8 w-8 mb-2 opacity-50" />
                    <p>No users available</p>
                  </>
                )}
              </div>
            ) : (
              <div className="p-2">
                {filteredUsers.map((user) => {
                  const isSelected = isUserSelected(user.userId);
                  return (
                    <div
                      key={user.userId}
                      className={`flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors ${
                        isSelected ? "bg-muted" : ""
                      }`}
                      onClick={() => handleToggleUser(user)}
                    >
                      <Checkbox
                        checked={isSelected}
                        id={`user-${user.userId}`}
                        onCheckedChange={() => handleToggleUser(user)}
                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <div className="flex flex-col min-w-0">
                        <Label
                          htmlFor={`user-${user.userId}`}
                          className="cursor-pointer font-medium text-sm"
                        >
                          {user.username}
                        </Label>
                        {user.role && (
                          <span className="text-xs text-muted-foreground truncate">
                            {user.role}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-500 ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
