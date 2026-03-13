import dayjs from 'dayjs';
import type { SheetMapping } from '../services/googleSheetService';

export const processDashboardData = (data: SheetMapping) => {
  const { 
    ProjectSummary = [], 
    ProjectContracting = [], 
    Worklog = [], 
    AllProjects = [],
    PlannedEffort = [],
    ActiveEmployees = []
  } = data || {};

  // Normalize AllProjects
  const normalizedProjects = AllProjects.map((p: any) => ({
    ...p,
    ProjectId: p.Title || p.Project || p.ProjectId,
    ProjectName: p.Title || p.Project || p.ProjectName,
  }));

  // Normalize ProjectSummary
  const normalizedSummary = ProjectSummary.map((p: any) => ({
    ...p,
    ProjectId: p.Project || p.ProjectId,
    ProjectName: p.Project || p.ProjectName,
    Estimate: parseFloat(p['Estimated effort (md)'] || p.Estimate || 0) || 0,
  }));
  
  // Normalize ProjectContracting
  const normalizedContracting = ProjectContracting.map((p: any) => ({
    ...p,
    ProjectId: p.Project || p.ProjectId,
    ContractValue: parseFloat(p.Cost || p.ContractValue || 0) || 0,
    PaidAmount: parseFloat(p.PaidAmount || 0) || 0,
  }));

  // Normalize Worklog
  const normalizedWorklog = Worklog.map((w: any) => {
      // Find a matching project ID. Try Parent Title first, then Repo, then ProjectId
      let pid = w['Parent Title'] || w.Repo || w.ProjectId;
      if (!pid) pid = 'Unknown Project';

      return {
        ...w,
        ProjectId: pid,
        Employee: w['Employee Name'] || w.Employee || w['Git Account'] || 'Unknown Employee',
        Hours: parseFloat(w.Hours || 0) || 0,
        Date: w.Timestamp ? dayjs(w.Timestamp, 'MM/DD/YYYY').format('YYYY-MM-DD') : (w.Date || dayjs().format('YYYY-MM-DD')),
        DetailedActivity: w['Task Description'] || w.DetailedActivity || w['Issue Title'] || 'Task'
      };
  });

  // Normalize Employees
  let normalizedEmployees = Array.isArray(ActiveEmployees) 
    ? ActiveEmployees.filter((e: any) => e.Name && !e['#REF!'] && e.Name !== 'Name').map((e: any) => ({
        ...e,
        Employee: e.Name,
        Name: e.Name,
        Role: e.Position || 'Member',
        Type: e.Type || 'Fulltime',
        Github: e['Git account'] || '',
        Telegram: e.Telegram || ''
      }))
    : [];
  
  if (normalizedEmployees.length === 0 && normalizedWorklog.length > 0) {
     const employeeSet = new Set(normalizedWorklog.map((w: any) => w.Employee).filter(Boolean));
     normalizedEmployees = Array.from(employeeSet).map(emp => ({ Employee: emp, Name: emp }));
  }

  // Normalize PlannedEffort
  const normalizedPlannedEffort = PlannedEffort.filter((e: any) => !e['#REF!']).map((p: any) => ({
    ...p,
    Employee: p['Employee Name'] || p.Employee,
    PlannedHours: parseFloat(p['Planned effort (md)'] || p.PlannedHours || 0) || 0,
  }));

  const normalizedData = {
      ProjectSummary: normalizedSummary,
      ProjectContracting: normalizedContracting,
      Worklog: normalizedWorklog,
      AllProjects: normalizedProjects,
      PlannedEffort: normalizedPlannedEffort,
      ActiveEmployees: normalizedEmployees
  };

  // Global KPIs
  const totalProjects = normalizedProjects.length || normalizedSummary.length || 0;
  const totalEstimate = normalizedSummary.reduce((acc: number, curr: any) => acc + (curr.Estimate || 0), 0) || 0;
  const totalActualEffort = normalizedWorklog.reduce((acc: number, curr: any) => acc + (curr.Hours || 0), 0) || 0;
  const totalContractValue = normalizedContracting.reduce((acc: number, curr: any) => acc + (curr.ContractValue || 0), 0) || 0;
  const totalPaidAmount = normalizedContracting.reduce((acc: number, curr: any) => acc + (curr.PaidAmount || 0), 0) || 0;

  // Resource Dashboard Logic (Plan vs Actual)
  const actualByEmployee = normalizedWorklog.reduce((acc: any, curr: any) => {
    const month = dayjs(curr.Date).format('YYYY-MM');
    const emp = curr.Employee;
    if (!acc[emp]) acc[emp] = {};
    acc[emp][month] = (acc[emp][month] || 0) + (curr.Hours || 0);
    return acc;
  }, {});

  return {
    globalKPIs: {
      totalProjects,
      totalEstimate,
      totalActualEffort,
      totalContractValue,
      totalPaidAmount,
    },
    raw: normalizedData,
    actualByEmployee,
    projectMetrics: calculateProjectMetrics(normalizedData)
  };
};

const calculateProjectMetrics = (normalizedData: any) => {
  const metrics: any = {};
  
  const projectsList = normalizedData.AllProjects.length > 0 ? normalizedData.AllProjects : normalizedData.ProjectSummary;

  projectsList.forEach((proj: any) => {
    const pid = proj.ProjectId;
    const worklog = normalizedData.Worklog.filter((w: any) => w.ProjectId === pid);
    const summary = normalizedData.ProjectSummary.find((s: any) => s.ProjectId === pid);
    
    const actual = worklog.reduce((acc: number, w: any) => acc + (w.Hours || 0), 0);
    const estimate = summary?.Estimate || 0;
    
    // Weekly burn rate
    const weeklyWork = worklog.reduce((acc: any, w: any) => {
      const week = dayjs(w.Date).startOf('week').format('YYYY-MM-DD');
      acc[week] = (acc[week] || 0) + (w.Hours || 0);
      return acc;
    }, {});
    
    const weeks = Object.keys(weeklyWork);
    const avgWeeklyBurn = weeks.length > 0 ? actual / weeks.length : 0;
    const remaining = Math.max(0, estimate - actual);
    const weeksToFinish = avgWeeklyBurn > 0 ? remaining / avgWeeklyBurn : 0;
    const forecastDate = weeksToFinish > 0 
        ? dayjs().add(Math.ceil(weeksToFinish), 'week').format('YYYY-MM-DD') 
        : 'N/A';

    metrics[pid] = {
      avgWeeklyBurn,
      remaining,
      forecastDate,
      weeksToFinish,
      actual,
      estimate
    };
  });
  
  return metrics;
};

export const filterData = (data: any, filters: { projectId?: string | null; employee?: string | null; dateRange?: [string, string] | null }) => {
  if (!data || !data.raw) return null;
  
  const { Worklog } = data.raw;
  let filteredWorklog = [...(Worklog || [])];
  
  if (filters.projectId) {
    filteredWorklog = filteredWorklog.filter((w: any) => w.ProjectId === filters.projectId);
  }
  
  if (filters.employee) {
    filteredWorklog = filteredWorklog.filter((w: any) => w.Employee === filters.employee);
  }
  
  if (filters.dateRange) {
    const [start, end] = filters.dateRange;
    filteredWorklog = filteredWorklog.filter((w: any) => {
      const d = dayjs(w.Date);
      return (d.isAfter(start) || d.isSame(start)) && (d.isBefore(end) || d.isSame(end));
    });
  }

  return {
    ...data,
    filteredWorklog,
    filters
  };
};
