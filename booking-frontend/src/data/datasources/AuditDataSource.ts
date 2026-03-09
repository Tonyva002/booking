import { api } from "../../core/api/axios";
import axios from "axios";
import type { AuditActions } from "../../domain/enums/AuditActions";

export default class AuditApiDataSource {
  async log(
    bookingId: number,
    action: AuditActions,
    oldValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null
  ): Promise<void> {
    try {
      await api.post(`/audit`, {
        bookingId,
        action,
        oldValue,
        newValue,
      });

    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.message ||
          "Error inesperado al registrar auditoría";

        throw new Error(message);
      }

      throw new Error("Error desconocido");
    }
  }
}