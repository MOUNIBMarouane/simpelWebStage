import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  PlusCircle,
  Trash2,
  Search,
  UsersRound,
  ShieldAlert,
  Users,
  UserPlus,
  CheckCircle2,
  Filter,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApprovalGroup } from "@/models/approval";
import approvalService from "@/services/approvalService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, Column } from "@/components/ui/data-table";
import ApprovalGroupCreateDialog from "@/components/approval/ApprovalGroupCreateDialog";

export default function ApprovalGroupsManagement() {
  const [approvalGroups, setApprovalGroups] = useState<ApprovalGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ApprovalGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ApprovalGroup | null>(
    null
  );
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // Fetch approval groups on component mount
  useEffect(() => {
    fetchApprovalGroups();
  }, []);

  // Handle selecting all groups when selectAll changes
  useEffect(() => {
    if (selectAll) {
      setSelectedGroups(filteredGroups.map((group) => group.id));
    } else {
      setSelectedGroups([]);
    }
  }, [selectAll, filteredGroups]);

  // Filter groups when search query or groups change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGroups(approvalGroups);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = approvalGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.comment?.toLowerCase().includes(query) ||
          group.stepTitle?.toLowerCase().includes(query) ||
          group.ruleType.toLowerCase().includes(query)
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, approvalGroups]);

  // Define table columns
  const columns: Column<ApprovalGroup>[] = [
    {
      id: "name",
      header: "Group Name",
      accessorKey: "name",
      cell: (row) => (
        <div className="font-medium text-blue-200 flex items-center">
          <UsersRound className="h-4 w-4 mr-2 text-blue-400" />
          {row.name}
        </div>
      ),
    },
    {
      id: "ruleType",
      header: "Approval Rule",
      accessorKey: "ruleType",
      cell: (row) => (
        <Badge
          className={`${
            row.ruleType === "All"
              ? "bg-emerald-600/60 text-emerald-100"
              : row.ruleType === "Any"
              ? "bg-amber-600/60 text-amber-100"
              : "bg-blue-600/60 text-blue-100"
          }`}
        >
          {row.ruleType === "All"
            ? "All Must Approve"
            : row.ruleType === "Any"
            ? "Any Can Approve"
            : "Sequential"}
        </Badge>
      ),
    },
    {
      id: "step",
      header: "Assigned Step",
      accessorKey: "stepTitle",
      cell: (row) => (
        <>
          {row.stepTitle ? (
            <span className="text-blue-200">{row.stepTitle}</span>
          ) : (
            <span className="text-blue-300/50 text-sm italic">
              No step assigned
            </span>
          )}
        </>
      ),
    },
    {
      id: "comment",
      header: "Comment",
      accessorKey: "comment",
      cell: (row) => (
        <>
          {row.comment ? (
            <span className="text-blue-200">{row.comment}</span>
          ) : (
            <span className="text-blue-300/50 text-sm italic">No comment</span>
          )}
        </>
      ),
    },
    {
      id: "approversCount",
      header: "Approvers",
      accessorKey: "approvers",
      cell: (row) => (
        <Badge className="bg-blue-800/60 text-blue-100">
          {row.approvers?.length || 0}{" "}
          {row.approvers?.length === 1 ? "member" : "members"}
        </Badge>
      ),
    },
  ];

  // Define bulk actions
  const bulkActions = [
    { label: "Delete Selected", value: "delete", color: "red" },
  ];

  const fetchApprovalGroups = async () => {
    try {
      setIsLoading(true);
      const data = await approvalService.getAllApprovalGroups();
      setApprovalGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      console.error("Failed to fetch approval groups:", error);
      toast.error("Failed to load approval groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await approvalService.deleteApprovalGroup(groupToDelete.id);
      setApprovalGroups((prev) =>
        prev.filter((group) => group.id !== groupToDelete.id)
      );
      toast.success(
        `Approval group "${groupToDelete.name}" deleted successfully`
      );
    } catch (error) {
      console.error(
        `Failed to delete approval group with ID ${groupToDelete.id}:`,
        error
      );
      toast.error("Failed to delete approval group");
    } finally {
      setGroupToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (group: ApprovalGroup) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleCreateGroupSuccess = () => {
    setCreateDialogOpen(false);
    fetchApprovalGroups();
    toast.success("Approval group created successfully");
  };

  const toggleGroupSelection = (id: number) => {
    setSelectedGroups((prev) =>
      prev.includes(id)
        ? prev.filter((groupId) => groupId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    if (selectedGroups.length === 0) return;

    try {
      // Delete each selected group
      const deletePromises = selectedGroups.map((id) =>
        approvalService.deleteApprovalGroup(id)
      );

      await Promise.all(deletePromises);

      setApprovalGroups((prev) =>
        prev.filter((group) => !selectedGroups.includes(group.id))
      );

      toast.success(
        `${selectedGroups.length} approval groups deleted successfully`
      );
      setSelectedGroups([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Failed to delete approval groups:", error);
      toast.error("Failed to delete selected approval groups");
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const openBulkDeleteDialog = () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select at least one approval group to delete");
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const handleViewModeChange = (mode: "list" | "card") => {
    setViewMode(mode);
  };

  const handleBulkActions = (
    action: string,
    selectedItems: ApprovalGroup[]
  ) => {
    if (action === "delete") {
      openBulkDeleteDialog();
    }
  };

  const handleRowSelect = (ids: (string | number)[]) => {
    setSelectedGroups(ids as number[]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-[#0a1033] border border-blue-900/30 rounded-lg p-6 mb-6 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-white flex items-center">
              <Users className="mr-3 h-6 w-6 text-blue-400" /> Approval Groups
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Manage approval groups for document workflows
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            New Approval Group
          </Button>
        </div>
      </div>

      {/* Search and Tools Section */}
      <div className="bg-[#1e2a4a] border border-blue-900/40 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search approval groups..."
              className="pl-10 bg-[#22306e] text-blue-100 border border-blue-900/40 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 hover:bg-blue-800/40 shadow-sm rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* View Toggle Buttons */}
            <div className="bg-[#101a3f] rounded-md border border-blue-900/40 flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewModeChange("list")}
                className={`rounded-r-none ${
                  viewMode === "list"
                    ? "bg-blue-800/50 text-white"
                    : "text-blue-300/70"
                }`}
              >
                <LayoutList className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewModeChange("card")}
                className={`rounded-l-none ${
                  viewMode === "card"
                    ? "bg-blue-800/50 text-white"
                    : "text-blue-300/70"
                }`}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedGroups.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={openBulkDeleteDialog}
                className="bg-red-700/70 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedGroups.length})
              </Button>
            )}
          </div>
        </div>

        {/* Selection Info */}
        {selectedGroups.length > 0 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-800/50">
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span>
                {selectedGroups.length} group
                {selectedGroups.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGroups([])}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear selection
            </Button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-[#0a1033] border border-blue-900/30 rounded-lg p-0 transition-all overflow-hidden">
        <DataTable
          data={filteredGroups}
          columns={columns}
          keyField="id"
          isLoading={isLoading}
          searchPlaceholder="Search approval groups..."
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          onRowSelect={handleRowSelect}
          onBulkAction={handleBulkActions}
          bulkActions={bulkActions}
          emptyStateMessage="No approval groups created yet"
          emptyStateIcon={
            <UsersRound className="h-10 w-10 mb-3 text-blue-400/50" />
          }
          emptySearchMessage="No approval groups found matching"
          hideSearchBar={true}
        />
      </div>

      {/* Selection summary area displayed at the bottom */}
      {selectedGroups.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a1033]/90 backdrop-blur-sm py-3 px-6 border-t border-blue-900/40 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-600 text-white px-3 py-1 text-sm">
              {selectedGroups.length} selected
            </Badge>
            <span className="text-blue-200">
              {selectedGroups.length === 1
                ? "1 group selected"
                : `${selectedGroups.length} groups selected`}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedGroups([])}
              className="border-blue-500/30 text-blue-300 hover:bg-blue-900/20"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={openBulkDeleteDialog}
              className="bg-red-600/80 hover:bg-red-700 text-white"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Create Approval Group Dialog */}
      <ApprovalGroupCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateGroupSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#0a1033] border border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-300">
              Delete Approval Group
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-300">
              Are you sure you want to delete the approval group "
              <span className="font-medium text-white">
                {groupToDelete?.name}
              </span>
              "? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-blue-500/30 text-blue-300 hover:bg-blue-950/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-red-600/80 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-[#0a1033] border border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-300">
              Delete Multiple Approval Groups
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-300">
              Are you sure you want to delete {selectedGroups.length} selected
              approval group{selectedGroups.length !== 1 ? "s" : ""}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-blue-500/30 text-blue-300 hover:bg-blue-950/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600/80 text-white hover:bg-red-700"
            >
              Delete All Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
