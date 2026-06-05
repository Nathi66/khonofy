import { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { parseUserImportFile, validateImportRows } from '@/lib/user-import';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import PageShell from '@/components/PageShell';
import SectionLoader from '@/components/SectionLoader';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { BadgeCheck, Users, Plus, UserCog, Shield, Crown, Search, ChevronDown, Upload, FileText } from 'lucide-react';

/**
 * @typedef {Object} CreateUserPayload
 * @property {string} email
 * @property {string} fullName
 * @property {string} password
 * @property {string} role
 * @property {string | null} [departmentId]
 * @property {string | null} [designationId]
 * @property {string} [admin_id]
 */

/**
 * @typedef {Object} AssignAdminPayload
 * @property {string} userId
 * @property {string | null} admin_id
 */

/**
 * @typedef {Object} UpdateUserProfilePayload
 * @property {string} userId
 * @property {string} role
 * @property {string | null} departmentId
 * @property {string | null} designationId
 */

/**
 * @typedef {Object} BulkImportUsersPayload
 * @property {Array<{
 *   fullName: string,
 *   email: string,
 *   departmentId: string | null,
 *   designationId: string | null,
 * }>} rows
 * @property {string} password
 * @property {string} role
 */

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  email: '',
  fullName: '',
  password: '',
  role: 'staff',
  admin_id: '',
  department_id: '',
  designation_id: '',
};

function userLabel(user) {
  return user?.full_name || user?.email || 'Unnamed user';
}

function roleLabel(role) {
  if (role === 'superuser') return 'Super User';
  if (role === 'admin') return 'Admin';
  if (role === 'staff') return 'Staff';
  return role || '—';
}

function isStaffDesignation(designation) {
  return designation.name.trim().toLowerCase() === 'staff';
}

function sortByName(users) {
  return [...users].sort((a, b) =>
    (a.full_name || a.email || '').localeCompare(b.full_name || b.email || ''),
  );
}

function matchesUserSearch(user, query, usersById) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const parts = [
    user.full_name,
    user.email,
    user.id,
    user.role === 'staff' && user.admin_id ? userLabel(usersById[user.admin_id]) : '',
  ].filter(Boolean);
  return parts.some((part) => part.toLowerCase().includes(q));
}

function TableSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-9 bg-background border-border text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function UserProfileExpandPanel({
  draftRole,
  draftDepartmentId,
  draftDesignationId,
  onRoleChange,
  onDepartmentChange,
  onDesignationChange,
  onSave,
  isSaving,
  sortedDepartments,
  sortedDesignations,
}) {
  return (
    <div className="px-4 pb-4 pt-2 bg-muted/10 border-t border-border">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        App Persona &amp; Profile
      </p>
      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Role</label>
          <Select value={draftRole} onValueChange={onRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superuser">Super User</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">The persona this user uses in the app.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Department</label>
          <Select value={draftDepartmentId} onValueChange={onDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {sortedDepartments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Designation</label>
          <Select value={draftDesignationId} onValueChange={onDesignationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {sortedDesignations.map((designation) => (
                <SelectItem key={designation.id} value={designation.id}>
                  {designation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="sm">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

function TablePagination({ page, totalPages, totalItems, onPageChange }) {
  if (totalItems <= PAGE_SIZE) return null;

  const safePage = Math.min(page, totalPages);
  const rangeStart = (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
      <p className="text-xs text-muted-foreground">
        Showing {rangeStart}–{rangeEnd} of {totalItems} users
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
        >
          Previous
        </Button>
        <span className="text-xs font-medium text-muted-foreground min-w-[3rem] text-center">
          {safePage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function UserTableSection({ title, description, icon: Icon, search, children }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {search}
      </div>
      {children}
    </div>
  );
}

export default function UserManagement() {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [draftRole, setDraftRole] = useState('staff');
  const [draftDepartmentId, setDraftDepartmentId] = useState('none');
  const [draftDesignationId, setDraftDesignationId] = useState('none');
  const [superuserSearch, setSuperuserSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [superuserPage, setSuperuserPage] = useState(1);
  const [staffPage, setStaffPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [importRows, setImportRows] = useState([]);
  const [importPassword, setImportPassword] = useState('');
  const [importRole, setImportRole] = useState('staff');
  const [importError, setImportError] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importResult, setImportResult] = useState(null);
  const [isParsingImport, setIsParsingImport] = useState(false);
  const importFileRef = useRef(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: currentUser?.role === 'superuser',
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => base44.entities.Department.list(),
    enabled: currentUser?.role === 'superuser',
  });

  const { data: designations = [] } = useQuery({
    queryKey: ['designations'],
    queryFn: () => base44.entities.Designation.list(),
    enabled: currentUser?.role === 'superuser',
  });

  const superuserUsers = useMemo(
    () => sortByName(users.filter((user) => user.role === 'superuser')),
    [users],
  );

  const adminUsers = useMemo(
    () => sortByName(users.filter((user) => user.role === 'admin')),
    [users],
  );

  const staffUsers = useMemo(
    () => sortByName(users.filter((user) => user.role === 'staff')),
    [users],
  );

  const usersById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users],
  );

  const departmentsById = useMemo(
    () => Object.fromEntries(departments.map((dept) => [dept.id, dept])),
    [departments],
  );

  const designationsById = useMemo(
    () => Object.fromEntries(designations.map((item) => [item.id, item])),
    [designations],
  );

  const sortedDepartments = useMemo(
    () => [...departments].sort((a, b) => a.name.localeCompare(b.name)),
    [departments],
  );

  const sortedDesignations = useMemo(
    () => [...designations]
      .filter((designation) => !isStaffDesignation(designation))
      .sort((a, b) => a.name.localeCompare(b.name)),
    [designations],
  );

  const filteredSuperuserUsers = useMemo(
    () => superuserUsers.filter((user) => matchesUserSearch(user, superuserSearch, usersById)),
    [superuserUsers, superuserSearch, usersById],
  );

  const filteredStaffUsers = useMemo(
    () => staffUsers.filter((user) => matchesUserSearch(user, staffSearch, usersById)),
    [staffUsers, staffSearch, usersById],
  );

  const filteredAdminUsers = useMemo(
    () => adminUsers.filter((user) => matchesUserSearch(user, adminSearch, usersById)),
    [adminUsers, adminSearch, usersById],
  );

  const superuserTotalPages = Math.max(1, Math.ceil(filteredSuperuserUsers.length / PAGE_SIZE));
  const staffTotalPages = Math.max(1, Math.ceil(filteredStaffUsers.length / PAGE_SIZE));
  const adminTotalPages = Math.max(1, Math.ceil(filteredAdminUsers.length / PAGE_SIZE));
  const safeSuperuserPage = Math.min(superuserPage, superuserTotalPages);
  const safeStaffPage = Math.min(staffPage, staffTotalPages);
  const safeAdminPage = Math.min(adminPage, adminTotalPages);

  const paginatedSuperuserUsers = useMemo(() => {
    const start = (safeSuperuserPage - 1) * PAGE_SIZE;
    return filteredSuperuserUsers.slice(start, start + PAGE_SIZE);
  }, [filteredSuperuserUsers, safeSuperuserPage]);

  const paginatedStaffUsers = useMemo(() => {
    const start = (safeStaffPage - 1) * PAGE_SIZE;
    return filteredStaffUsers.slice(start, start + PAGE_SIZE);
  }, [filteredStaffUsers, safeStaffPage]);

  const paginatedAdminUsers = useMemo(() => {
    const start = (safeAdminPage - 1) * PAGE_SIZE;
    return filteredAdminUsers.slice(start, start + PAGE_SIZE);
  }, [filteredAdminUsers, safeAdminPage]);

  const existingEmails = useMemo(
    () => new Set(users.map((user) => user.email?.trim().toLowerCase()).filter(Boolean)),
    [users],
  );

  const validImportRows = useMemo(
    () => importRows.filter((row) => row.valid),
    [importRows],
  );

  const staffCountByAdmin = useMemo(() => {
    const counts = {};
    for (const user of users) {
      if (user.role === 'staff' && user.admin_id) {
        counts[user.admin_id] = (counts[user.admin_id] || 0) + 1;
      }
    }
    return counts;
  }, [users]);

  const createUser = useMutation({
    /** @param {CreateUserPayload} payload */
    mutationFn: async (payload) => {
      const created = await base44.entities.User.create(payload);
      return created;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      closeForm();
    },
  });

  const assignAdmin = useMutation({
    /** @param {AssignAdminPayload} variables */
    mutationFn: async ({ userId, admin_id }) => {
      return base44.entities.User.update(userId, { admin_id: admin_id || null });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      closeAssignDialog();
    },
  });

  const bulkImportUsers = useMutation({
    /**
     * @param {BulkImportUsersPayload} variables
     */
    mutationFn: async (variables) => {
      const { rows, password, role } = variables;
      const result = { created: 0, failed: [] };
      for (const row of rows) {
        try {
          await base44.entities.User.create({
            email: row.email.trim(),
            fullName: row.fullName.trim(),
            password,
            role,
            departmentId: row.departmentId,
            designationId: row.designationId,
          });
          result.created += 1;
        } catch (error) {
          result.failed.push({
            email: row.email,
            message: error instanceof Error ? error.message : 'Create failed',
          });
        }
      }
      return result;
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setImportResult(result);
    },
  });

  const updateUserProfile = useMutation({
    /** @param {UpdateUserProfilePayload} variables */
    mutationFn: async ({ userId, role, departmentId, designationId }) => {
      return base44.entities.User.update(userId, {
        role,
        departmentId,
        designationId,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openImport = () => {
    setShowImport(true);
    setImportRows([]);
    setImportPassword('');
    setImportRole('staff');
    setImportError('');
    setImportFileName('');
    setImportResult(null);
  };

  const closeImport = () => {
    setShowImport(false);
    setImportRows([]);
    setImportPassword('');
    setImportRole('staff');
    setImportError('');
    setImportFileName('');
    setImportResult(null);
    setIsParsingImport(false);
    if (importFileRef.current) importFileRef.current.value = '';
  };

  const handleImportFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingImport(true);
    setImportError('');
    setImportResult(null);
    setImportFileName(file.name);

    try {
      const parsed = await parseUserImportFile(file);
      const validated = validateImportRows(parsed, {
        departments,
        designations,
        existingEmails,
      });
      setImportRows(validated);
      if (!validated.some((row) => row.valid)) {
        setImportError(
          'No valid users to import. Each row must include full name, email, department, and designation that match existing tags.',
        );
      }
    } catch (error) {
      setImportRows([]);
      setImportError(error instanceof Error ? error.message : 'Failed to read the document.');
    } finally {
      setIsParsingImport(false);
    }
  };

  const handleBulkImport = () => {
    if (!importPassword.trim() || validImportRows.length === 0) return;
    bulkImportUsers.mutate({
      rows: validImportRows,
      password: importPassword,
      role: importRole,
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const openAssignDialog = (staffUser) => {
    setAssignTarget(staffUser);
    setSelectedAdminId(staffUser.admin_id || 'none');
  };

  const closeAssignDialog = () => {
    setAssignTarget(null);
    setSelectedAdminId('');
  };

  const toggleUserExpand = (user) => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
      return;
    }
    setExpandedUserId(user.id);
    setDraftRole(user.role || 'staff');
    setDraftDepartmentId(user.department_id || 'none');
    setDraftDesignationId(user.designation_id || 'none');
  };

  const handleSubmit = () => {
    if (!form.email.trim() || !form.password.trim()) return;
    /** @type {CreateUserPayload} */
    const payload = {
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      password: form.password,
      role: form.role,
    };
    if (form.department_id) {
      payload.departmentId = form.department_id;
    }
    if (form.designation_id) {
      payload.designationId = form.designation_id;
    }
    if (form.role === 'staff' && form.admin_id) {
      payload.admin_id = form.admin_id;
    }
    createUser.mutate(payload);
  };

  const handleAssign = () => {
    if (!assignTarget) return;
    assignAdmin.mutate({
      userId: assignTarget.id,
      admin_id: selectedAdminId === 'none' ? null : selectedAdminId,
    });
  };

  const handleSaveProfile = (userId) => {
    updateUserProfile.mutate({
      userId,
      role: draftRole,
      departmentId: draftDepartmentId === 'none' ? null : draftDepartmentId,
      designationId: draftDesignationId === 'none' ? null : draftDesignationId,
    });
  };

  if (currentUser?.role !== 'superuser') {
    return (
      <PageShell>
        <p className="text-center text-muted-foreground">Access restricted to super users.</p>
      </PageShell>
    );
  }

  const staffHeader = (
    <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_1fr_120px] gap-4 px-4 py-3 border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      <span>Name</span>
      <span>Email</span>
      <span>Department</span>
      <span>Designation</span>
      <span>Role</span>
      <span>Assigned Admin</span>
      <span>Actions</span>
    </div>
  );

  const roleTableHeader = (
    <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_120px] gap-4 px-4 py-3 border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      <span>Name</span>
      <span>Email</span>
      <span>Department</span>
      <span>Designation</span>
      <span>Role</span>
      <span>Staff Assigned</span>
    </div>
  );

  return (
    <PageShell>
      <PageHeader
        title="User Management"
        description="Create super users, admins, and staff. Assign staff to admins who will manage their work."
        icon={Users}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={openImport} className="gap-2">
              <Upload className="w-4 h-4" />
              Import Users
            </Button>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              New User
            </Button>
          </div>
        }
      />

      {isLoading ? <SectionLoader label="Loading users..." /> : null}

      <div className="space-y-6">
        <UserTableSection
          title="Super Users"
          description="Click a super user to expand and edit their role, department, and designation."
          icon={Crown}
          search={
            <TableSearch
              value={superuserSearch}
              onChange={(value) => {
                setSuperuserSearch(value);
                setSuperuserPage(1);
                setExpandedUserId(null);
              }}
              placeholder="Search super users..."
            />
          }
        >
          {roleTableHeader}
          <div className="divide-y divide-border">
            {paginatedSuperuserUsers.map((user) => {
              const isExpanded = expandedUserId === user.id;
              return (
                <div key={user.id} className={isExpanded ? 'bg-muted/10' : ''}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleUserExpand(user)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleUserExpand(user);
                      }
                    }}
                    className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_120px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                      <p className="font-medium text-foreground truncate">{userLabel(user)}</p>
                    </div>
                    <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {departmentsById[user.department_id]?.name || '—'}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {designationsById[user.designation_id]?.name || '—'}
                    </span>
                    <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300">
                      {roleLabel(user.role)}
                    </span>
                    <span className="text-sm text-muted-foreground">—</span>
                  </div>
                  {isExpanded ? (
                    <UserProfileExpandPanel
                      draftRole={draftRole}
                      draftDepartmentId={draftDepartmentId}
                      draftDesignationId={draftDesignationId}
                      onRoleChange={setDraftRole}
                      onDepartmentChange={setDraftDepartmentId}
                      onDesignationChange={setDraftDesignationId}
                      onSave={() => handleSaveProfile(user.id)}
                      isSaving={updateUserProfile.isPending}
                      sortedDepartments={sortedDepartments}
                      sortedDesignations={sortedDesignations}
                    />
                  ) : null}
                </div>
              );
            })}
            {superuserUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <Crown className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">No super users yet</p>
                <p className="text-muted-foreground text-sm">Create a super user to manage the system.</p>
              </div>
            )}
            {superuserUsers.length > 0 && filteredSuperuserUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">No super users match your search</p>
                <p className="text-muted-foreground text-sm">Try a different name or email.</p>
              </div>
            )}
          </div>
          <TablePagination
            page={safeSuperuserPage}
            totalPages={superuserTotalPages}
            totalItems={filteredSuperuserUsers.length}
            onPageChange={(nextPage) => {
              setSuperuserPage(nextPage);
              setExpandedUserId(null);
            }}
          />
        </UserTableSection>

        <UserTableSection
          title="Staff Users"
          description="Click a staff member to expand and edit their role, department, and designation, or use Assign to link them to an admin."
          icon={Users}
          search={
            <TableSearch
              value={staffSearch}
              onChange={(value) => {
                setStaffSearch(value);
                setStaffPage(1);
                setExpandedUserId(null);
              }}
              placeholder="Search staff..."
            />
          }
        >
          {staffHeader}
          <div className="divide-y divide-border">
            {paginatedStaffUsers.map((user) => {
              const isExpanded = expandedUserId === user.id;
              return (
                <div key={user.id} className={isExpanded ? 'bg-muted/10' : ''}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleUserExpand(user)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleUserExpand(user);
                      }
                    }}
                    className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_1fr_120px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                      <p className="font-medium text-foreground truncate">{userLabel(user)}</p>
                    </div>
                    <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {departmentsById[user.department_id]?.name || '—'}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {designationsById[user.designation_id]?.name || '—'}
                    </span>
                    <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground">
                      {roleLabel(user.role)}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {user.admin_id ? (
                        <p className="truncate text-foreground">{userLabel(usersById[user.admin_id])}</p>
                      ) : (
                        <p className="text-amber-600 dark:text-amber-400">Not assigned</p>
                      )}
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAssignDialog(user);
                        }}
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        Assign
                      </Button>
                    </div>
                  </div>
                  {isExpanded ? (
                    <UserProfileExpandPanel
                      draftRole={draftRole}
                      draftDepartmentId={draftDepartmentId}
                      draftDesignationId={draftDesignationId}
                      onRoleChange={setDraftRole}
                      onDepartmentChange={setDraftDepartmentId}
                      onDesignationChange={setDraftDesignationId}
                      onSave={() => handleSaveProfile(user.id)}
                      isSaving={updateUserProfile.isPending}
                      sortedDepartments={sortedDepartments}
                      sortedDesignations={sortedDesignations}
                    />
                  ) : null}
                </div>
              );
            })}
            {staffUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <BadgeCheck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">No staff users yet</p>
                <p className="text-muted-foreground text-sm">Create a staff user to get started.</p>
              </div>
            )}
            {staffUsers.length > 0 && filteredStaffUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">No staff users match your search</p>
                <p className="text-muted-foreground text-sm">Try a different name or email.</p>
              </div>
            )}
          </div>
          <TablePagination
            page={safeStaffPage}
            totalPages={staffTotalPages}
            totalItems={filteredStaffUsers.length}
            onPageChange={(nextPage) => {
              setStaffPage(nextPage);
              setExpandedUserId(null);
            }}
          />
        </UserTableSection>

        <UserTableSection
          title="Admin Users"
          description="Click an admin to expand and edit their role, department, and designation."
          icon={Shield}
          search={
            <TableSearch
              value={adminSearch}
              onChange={(value) => {
                setAdminSearch(value);
                setAdminPage(1);
                setExpandedUserId(null);
              }}
              placeholder="Search admins..."
            />
          }
        >
          {roleTableHeader}
          <div className="divide-y divide-border">
            {paginatedAdminUsers.map((user) => {
              const isExpanded = expandedUserId === user.id;
              return (
                <div key={user.id} className={isExpanded ? 'bg-muted/10' : ''}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleUserExpand(user)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleUserExpand(user);
                      }
                    }}
                    className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_120px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                      <p className="font-medium text-foreground truncate">{userLabel(user)}</p>
                    </div>
                    <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {departmentsById[user.department_id]?.name || '—'}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {designationsById[user.designation_id]?.name || '—'}
                    </span>
                    <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {roleLabel(user.role)}
                    </span>
                    <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground">
                      {staffCountByAdmin[user.id] || 0} staff
                    </span>
                  </div>
                  {isExpanded ? (
                    <UserProfileExpandPanel
                      draftRole={draftRole}
                      draftDepartmentId={draftDepartmentId}
                      draftDesignationId={draftDesignationId}
                      onRoleChange={setDraftRole}
                      onDepartmentChange={setDraftDepartmentId}
                      onDesignationChange={setDraftDesignationId}
                      onSave={() => handleSaveProfile(user.id)}
                      isSaving={updateUserProfile.isPending}
                      sortedDepartments={sortedDepartments}
                      sortedDesignations={sortedDesignations}
                    />
                  ) : null}
                </div>
              );
            })}
            {adminUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">No admin users yet</p>
                <p className="text-muted-foreground text-sm">Create an admin user to manage staff.</p>
              </div>
            )}
            {adminUsers.length > 0 && filteredAdminUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground">No admin users match your search</p>
                <p className="text-muted-foreground text-sm">Try a different name or email.</p>
              </div>
            )}
          </div>
          <TablePagination
            page={safeAdminPage}
            totalPages={adminTotalPages}
            totalItems={filteredAdminUsers.length}
            onPageChange={(nextPage) => {
              setAdminPage(nextPage);
              setExpandedUserId(null);
            }}
          />
        </UserTableSection>
      </div>

      <Dialog open={showImport} onOpenChange={(open) => (open ? setShowImport(true) : closeImport())}>
        <DialogContent className="max-w-3xl max-h-[90dvh] flex flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-3">
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription>
              Upload a CSV or PDF with user names, emails, departments, and designations.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 space-y-4 pb-4">
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
              <input
                ref={importFileRef}
                type="file"
                accept=".csv,.pdf,text/csv,application/pdf"
                className="hidden"
                onChange={handleImportFileChange}
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Upload document</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV columns: Name, Email, Department, Designation. PDF files with the same fields are also supported.
                    </p>
                    {importFileName ? (
                      <p className="text-xs text-foreground mt-2 truncate">{importFileName}</p>
                    ) : null}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 flex-shrink-0"
                  onClick={() => importFileRef.current?.click()}
                  disabled={isParsingImport || bulkImportUsers.isPending}
                >
                  <Upload className="w-4 h-4" />
                  {isParsingImport ? 'Reading...' : 'Choose File'}
                </Button>
              </div>
            </div>

            {importError ? (
              <p className="text-sm text-destructive">{importError}</p>
            ) : null}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Default Password *</label>
                <Input
                  type="password"
                  placeholder="Temporary password for all imported users"
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Default Role</label>
                <Select value={importRole} onValueChange={setImportRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superuser">Super User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {importRows.length > 0 ? (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Preview</p>
                  <p className="text-xs text-muted-foreground">
                    {validImportRows.length} ready · {importRows.length - validImportRows.length} skipped
                  </p>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-border">
                  {importRows.map((row) => (
                    <div key={`${row.rowNumber}-${row.email}`} className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{row.fullName || 'Unnamed user'}</p>
                        <span className="text-muted-foreground">{row.email}</span>
                        {row.valid ? (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ready</span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Skipped</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {row.department || 'No department'} · {row.designation || 'No designation'}
                      </p>
                      {row.issues.length > 0 ? (
                        <p className="text-xs text-destructive mt-1">{row.issues.join(' · ')}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {importResult ? (
              <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                <p className="font-medium text-foreground">
                  Created {importResult.created} user{importResult.created === 1 ? '' : 's'}.
                </p>
                {importResult.failed.length > 0 ? (
                  <p className="text-destructive mt-1">
                    {importResult.failed.length} failed: {importResult.failed.map((item) => item.email).join(', ')}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex-shrink-0 px-6 py-4 border-t border-border bg-card">
            <Button variant="outline" onClick={closeImport}>
              {importResult ? 'Close' : 'Cancel'}
            </Button>
            <Button
              onClick={handleBulkImport}
              disabled={
                !importPassword.trim()
                || validImportRows.length === 0
                || bulkImportUsers.isPending
                || isParsingImport
              }
            >
              {bulkImportUsers.isPending
                ? 'Creating users...'
                : `Create ${validImportRows.length} User${validImportRows.length === 1 ? '' : 's'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showForm} onOpenChange={(open) => (open ? setShowForm(true) : closeForm())}>
        <DialogContent className="max-w-md max-h-[90dvh] flex flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-3">
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new super user, admin, or staff user to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <Input
                placeholder="e.g. Jane Doe"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
              <Input
                type="email"
                placeholder="e.g. jane@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Temporary Password *</label>
              <Input
                type="password"
                placeholder="Set a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Role</label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value, admin_id: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superuser">Super User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Department</label>
              <Select
                value={form.department_id || 'none'}
                onValueChange={(value) => setForm({ ...form, department_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {sortedDepartments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Designation</label>
              <Select
                value={form.designation_id || 'none'}
                onValueChange={(value) => setForm({ ...form, designation_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {sortedDesignations.map((designation) => (
                    <SelectItem key={designation.id} value={designation.id}>
                      {designation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.role === 'staff' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Assign to Admin (optional)</label>
                <Select
                  value={form.admin_id || 'none'}
                  onValueChange={(value) => setForm({ ...form, admin_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {adminUsers.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {userLabel(admin)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="flex-shrink-0 px-6 py-4 border-t border-border bg-card">
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.email.trim() || !form.password.trim() || createUser.isPending}>
              {createUser.isPending ? 'Saving...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignTarget} onOpenChange={(open) => { if (!open) closeAssignDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Admin to {userLabel(assignTarget)}
            </DialogTitle>
            <DialogDescription>
              Choose which admin will manage this staff member&apos;s tasks, timesheets, and team activity.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Managing Admin</label>
            <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None — unassigned</SelectItem>
                {adminUsers.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    {userLabel(admin)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAssignDialog}>Cancel</Button>
            <Button onClick={handleAssign} disabled={assignAdmin.isPending}>
              {assignAdmin.isPending ? 'Saving...' : 'Save Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
