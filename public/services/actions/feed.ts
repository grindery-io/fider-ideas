import { http, Result } from "@fider/services/http"

export const getFeedToken = async (): Promise<Result<{ feedToken: string; userTelegramID: string }>> => {
  return await http.get(`/_api/feed/token`)
}
