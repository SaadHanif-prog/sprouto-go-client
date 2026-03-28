import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Site = {
  id: string;
  name: string;
  url: string;
  userId: string;
  plan: "starter" | "pro";
  entitlementId: string;
  liveUrl?: string;
  gaMeasurementId?: string;
};

type SiteState = {
  sites: Site[];
  selectedSiteId: string | null;
};

const initialState: SiteState = {
  sites: [],
  selectedSiteId: null,
};

const siteSlice = createSlice({
  name: "SITE",
  initialState,
  reducers: {
    setSites: (state, action: PayloadAction<Site[]>) => {
      state.sites = action.payload;

      const exists = action.payload.find((s) => s.id === state.selectedSiteId);

      if (!exists && action.payload.length > 0) {
        state.selectedSiteId = action.payload[0].id;
      }
    },

    setSelectedSite: (state, action: PayloadAction<string>) => {
      state.selectedSiteId = action.payload;
    },

    clearSites: (state) => {
      state.sites = [];
      state.selectedSiteId = null;
    },
  },
});

export const { setSites, setSelectedSite, clearSites } = siteSlice.actions;

export default siteSlice.reducer;

export const selectSites = (state: any) => state.site.sites;

export const selectSelectedSiteId = (state: any) => state.site.selectedSiteId;

export const selectSelectedSite = (state: any) => {
  const { sites, selectedSiteId } = state.site;
  return sites.find((s: any) => s.id === selectedSiteId);
};
