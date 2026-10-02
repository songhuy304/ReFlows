import { apiClient } from "@/lib/axios";
import { IApiBaseResponse, IPaginatedResponse, IResponse } from "@/types/api.type";
import {
  IChatWorkflowPayload,
  IChatWorkflowResponseData,
  ICreateWorkflowPayload,
  IGetWorkflowsParams,
  IUpdateWorkflowPayload,
  IWorkflow,
} from "../types";

const AI_REQUEST_TIMEOUT_MS = 60_000;

const PATH = {
  BASE: "/workflows",
  DETAIL: (id: number | string) => `/workflows/${id}`,
  CHAT: (id: number | string) => `/workflows/${id}/chat`,
};

export const workflowService = {
  createWorkflow: (
    payload: ICreateWorkflowPayload
  ): Promise<IResponse<IWorkflow>> => apiClient.post(PATH.BASE, payload),

  getWorkflows: (
    params?: IGetWorkflowsParams
  ): Promise<IPaginatedResponse<IWorkflow>> =>
    apiClient.get(PATH.BASE, { params }),

  getWorkflowDetail: (
    id: number | string
  ): Promise<IResponse<IWorkflow>> => apiClient.get(PATH.DETAIL(id)),

  updateWorkflow: (
    id: number | string,
    payload: IUpdateWorkflowPayload
  ): Promise<IResponse<IWorkflow>> => apiClient.patch(PATH.DETAIL(id), payload),

  deleteWorkflow: (
    id: number | string
  ): Promise<IApiBaseResponse> => apiClient.delete(PATH.DETAIL(id)),

  chatWorkflow: (
    id: number | string,
    payload: IChatWorkflowPayload
  ): Promise<IResponse<IChatWorkflowResponseData>> =>
    apiClient.post(PATH.CHAT(id), payload, { timeout: AI_REQUEST_TIMEOUT_MS }),
};
