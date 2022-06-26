// https://github.com/Aynh/google-drive-as-cdn
interface GDriveItem {
  id: string;
  path: string;
  url: string;
  mimeType: string;
  size?: string;
  imageMediaMetadata?: {
    height: number;
    width: number;
    rotation: string;
  };
}

export const useGDrive = () => {
  const config = useRuntimeConfig();

  return {
    list: async (path: string, folder?: boolean) => {
      const url = new URL(config.gdriveCdn.url);
      url.pathname = path;

      url.searchParams.append('recursive', 'true');
      if (folder !== true) {
        url.searchParams.append('folder', 'false');
      }

      return $fetch<GDriveItem[]>(url.toString(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.gdriveCdn.token}` },
      }).catch(() => []);
    },
  };
};
