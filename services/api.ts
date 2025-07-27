// Structure for request options that may be supplied to the request
export type RequestOptions = {
  method?: "GET" | "POST";
  body?: any;
  headers?: Record<string, string>;
  queries?: Record<string, string>;
};

// Function to upload files
export async function uploadFile(
  url: string,
  endpoint: string,
  fileUri: string,
  fileFieldName: string,
  fileName: string,
  formFields: Record<string, string>,
  headers: Record<string, string>
) {
  // FIX ME: DEBUG
  // console.log("File URI:", fileUri);
  // console.log("File name:", fileName);

  // Construct URL
  const finalURL = `${url}${endpoint}`;

  // Create form data
  const formData = new FormData();

  // Append form fields first
  for (const [key, value] of Object.entries(formFields)) {
    formData.append(key, value);
  }

  // Determine MIME type based on file extension
  const getAudioMimeType = (filename: string): string => {
    const extension = filename.toLowerCase().split(".").pop();
    switch (extension) {
      case "m4a":
        return "audio/m4a";
      case "mp3":
        return "audio/mpeg";
      case "wav":
        return "audio/wav";
      case "ogg":
        return "audio/ogg";
      case "flac":
        return "audio/flac";
      case "webm":
        return "audio/webm";
      case "mp4":
        return "audio/mp4";
      case "mpeg":
        return "audio/mpeg";
      case "mpga":
        return "audio/mpeg";
      case "oga":
        return "audio/ogg";
      default:
        return "audio/m4a"; // Default fallback
    }
  };

  const mimeType = getAudioMimeType(fileName);
  // FIX ME: DEBUG
  // console.log("Using MIME type:", mimeType);

  // React Native FormData expects an object with uri, type, and name
  formData.append(fileFieldName, {
    uri: fileUri,
    type: mimeType,
    name: fileName,
  } as any);

  // FIX ME: DEBUG
  // console.log("Form fields:", formFields);
  // console.log("Headers:", headers);

  try {
    // Make POST request with form data
    const apiResponse = await fetch(finalURL, {
      method: "POST",
      headers: {
        ...headers,
        // DO NOT set Content-Type, let fetch set it with boundary for multipart
      },
      body: formData,
    });

    // FIX ME: DEBUG
    // console.log("Response status:", apiResponse.status);
    // console.log(
    //   "Response headers:",
    //   Object.fromEntries(apiResponse.headers.entries())
    // );

    const data = await apiResponse.json();
    // FIX ME: DEBUG
    // console.log("Response data:", data);

    if (!apiResponse.ok) {
      const apiError = data?.error;
      if (apiError) {
        const code = apiError.code || "unknown_error";
        const type = apiError.type || "unknown_type";
        const param = apiError.param ?? "n/a";
        const message = apiError.message || "No error message provided";
        throw new Error(`[${code}] ${type} - ${message} (param: ${param})`);
      }
      throw new Error(`Upload failed with status ${apiResponse.status}`);
    }

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Function for sending requests to the remote server
export async function sendRequest(
  url: string,
  endpoint: string,
  options: RequestOptions = {}
) {
  // Build headers & query string for request
  const headers = { ...options.headers };
  const queryString = buildQueryString(options.queries);

  // Build final URL where the request will be sent
  const finalURL = `${url}${endpoint}${queryString}`;

  // Build body of the request
  const body = buildRequestBody(options.body);

  // FIX ME: DEBUG
  // console.log(body);

  // Execute the request
  const response = await fetch(finalURL, {
    method: options.method || "GET",
    headers: headers,
    body: body,
  });

  // Try to parse the data
  let data: any = null;
  try {
    data = await response.json();
  } catch (error) {
    // If parsing fails, the response is likely not JSON or missing
    data = null;
  }

  // FIX ME: DEBUG
  // console.log(data);

  // Handle errors
  if (!response.ok) {
    const apiError = data?.error;

    // Handle structured OpenAI-like error
    if (apiError && typeof apiError === "object") {
      const code = apiError.code || "unknown_error";
      const type = apiError.type || "unknown_type";
      const param = apiError.param ?? "n/a";
      const message = apiError.message || "No error message provided";

      const detailedMessage = `[${code}] ${type} - ${message} (param: ${param})`;
      throw new Error(detailedMessage);
    }

    // Fallback for unstructured error shape
    const genericMessage =
      data?.message || data?.detail || `API Error: ${response.status}`;

    throw new Error(genericMessage);
  }

  return data;
}

// A helper function to build request body
function buildRequestBody(body?: any): BodyInit | undefined {
  // Do not stringify if body is FormData
  if (body instanceof FormData) return body;
  if (body !== undefined) return JSON.stringify(body);
  return undefined;
}

// A helper function to build the query string
function buildQueryString(queries?: Record<string, string>): string {
  if (!queries || Object.keys(queries).length === 0) return "";
  return `?${new URLSearchParams(queries).toString()}`;
}
