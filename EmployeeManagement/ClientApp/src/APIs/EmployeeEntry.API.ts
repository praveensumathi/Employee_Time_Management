import { Get, Post, Put } from "./Utils";

export interface IEmployeeEntryDetails {
  id: number;
  date: Date;
  inTime: Date;
  outTime: Date;
  breaks: IBreak[];
}

export interface IBreak {
  id: number;
  breakStart: Date;
  breakFinished: Date;
  employeeEntry: IEmployeeEntryDetails;
}

export async function GetAllDetails(): Promise<IEmployeeEntryDetails[]> {
  return Get("/api/employee");
}

export async function GetAuthUserEntryDetails(): Promise<
  IEmployeeEntryDetails[]
> {
  return Get("/api/employee/GetAuthUserEntryDetails");
}

export async function AddNewEntry(): Promise<IEmployeeEntryDetails> {
  return Post("/api/employee", {});
}

export async function AddBreak(id: number): Promise<IBreak> {
  return Post("/api/employee/AddBreak", { id }, { id });
}

export async function UpdateQuerySet(breakId: number): Promise<IBreak> {
  return Put("/api/employee/UpdateBreak", { breakId }, { breakId });
}

export async function AddOutTime(id: number): Promise<IEmployeeEntryDetails> {
  return Put("/api/employee/AddOutTime", { id }, { id });
}
