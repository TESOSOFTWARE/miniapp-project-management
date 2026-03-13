import Papa from 'papaparse';

export interface SheetMapping {
  ProjectSummary: any[];
  ProjectContracting: any[];
  Worklog: any[];
  PlannedEffort: any[];
  AllProjects: any[];
  ActiveEmployees: any[];
  AllIssues: any[];
  CurrentMonthEffort: any[];
}

export const REQUIRED_SHEETS = [
  'ProjectSummary',
  'ProjectContracting',
  'Worklog',
  'PlannedEffort',
  'AllProjects',
  'ActiveEmployees', // Correct CamelCase name
  'AllIssues',
  'CurrentMonthEffort',
];

const fetchSheetAsCSV = async (sheetId: string, sheetName: string): Promise<string> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${sheetName}`);
  }
  return await response.text();
};

const parseCSV = (csvString: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error: any) => reject(error),
    });
  });
};

export const fetchAllSheets = async (sheetId: string): Promise<SheetMapping> => {
  const fetchPromises = REQUIRED_SHEETS.map(async (name) => {
    const csvData = await fetchSheetAsCSV(sheetId, name);
    const jsonData = await parseCSV(csvData);
    return { name, data: jsonData };
  });

  const results = await Promise.all(fetchPromises);
  
  const mapping: any = {};
  results.forEach((res) => {
    mapping[res.name] = res.data;
  });

  return mapping as SheetMapping;
};
