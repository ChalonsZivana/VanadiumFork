import type { boquettes, fams, pg } from "@prisma/client";

const simplifyBucque = (txt: string) => txt.replace(/[.*+?^${}()|[\]\\]/g, "");
const escapeRegExp = (txt: string) =>
  txt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const regexify = (txt: string) =>
  "\\b" +
  txt
    .split("")
    .map((e) => e + "?")
    .join("") +
  "\\b";

export type SelectTypes = "PG" | "Fams" | "Boquette" | "Tout";

interface Searchable {
  regex: RegExp;
}

export function createDataToSort(data: {
  pgs: Partial<pg>[];
  boquettes: Partial<boquettes>[];
  fams: Partial<fams>[];
}): DataToSort {
  return {
    SearchPgs: data.pgs.map((e) => createPg(e)),
    SearchFams: data.fams.map((e) => createSearchFams(e)),
    SearchBoquettes: data.boquettes.map((e) => createSearchBoquette(e)),
  };
}

interface SearchPg extends Searchable {
  pg: Partial<pg>;
}
function createPg(pg: Partial<pg>) {
  let txt = []; // [`\\b${pg.nums}\\b`,`\\b${pg.proms}\\b`]
  if (pg.nom) txt.push(regexify(simplifyBucque(pg.nom.toLowerCase())));
  if (pg.prenom) txt.push(regexify(simplifyBucque(pg.prenom.toLowerCase())));
  if (pg.bucque) txt.push(regexify(simplifyBucque(pg.bucque.toLowerCase()))); //need to escapeRegex complex bucques
  return { regex: new RegExp(txt.join("|"), "g"), pg: pg }; // creates this /\b89\b|\b223\b/\bLe'Me\b/
}
interface SearchBoquette extends Searchable {
  boquette: Partial<boquettes>;
}
function createSearchBoquette(boq: Partial<boquettes>): SearchBoquette {
  let text: string[] = [];
  if (boq.nom_simple) text.push(regexify(boq.nom_simple.toLowerCase()));
  if (boq.nom) text.push(regexify(boq.nom.toLowerCase()));
  return { regex: new RegExp(text.join("|"), "g"), boquette: boq };
}
interface SearchFams extends Searchable {
  fams: Partial<fams>;
}
function createSearchFams(fams: Partial<fams>): SearchFams {
  return { regex: new RegExp(`\\b${fams.nums}\\b`, "g"), fams: fams };
}

export interface DataToSort {
  SearchFams: SearchFams[];
  SearchPgs: SearchPg[];
  SearchBoquettes: SearchBoquette[];
}

export type SearchItemsMap = {
  [K in SelectTypes]: K extends "PG"
    ? SearchPg[]
    : K extends "Fams"
      ? SearchFams[]
      : K extends "Boquette"
        ? SearchBoquette[]
        : [];
};

let selected: SelectTypes = "Tout";

export function getSearch(
  searchText: string,
  searchNums: number | null,
  searchProms: number | null,
  dataToSort: DataToSort,
): SearchItemsMap {
  let searchItems: SearchItemsMap = {
    PG: [],
    Fams: [],
    Boquette: [],
    Tout: [],
  };
  const sT = searchText.toLowerCase().trimEnd();
  const l = sT.split(" ").length;
  if (searchText == "" && searchNums == null && searchProms == null)
    return searchItems;

  switch (selected) {
    case "Tout":
    case "PG":
      searchItems.PG = dataToSort.SearchPgs.filter((e) => {
        if (
          searchNums != null &&
          searchNums !== e.pg.nums &&
          !isNaN(searchNums)
        )
          return false;
        if (
          searchProms != null &&
          searchProms !== e.pg.proms &&
          !isNaN(searchProms)
        )
          return false;

        if (searchText !== "") {
          const prenomMatch = sT
            .match(
              new RegExp(
                regexify(simplifyBucque(e.pg.prenom!.toLowerCase())),
                "g",
              ),
            )
            ?.filter((e) => e != "");
          const nomMatch = sT
            .match(
              new RegExp(
                regexify(simplifyBucque(e.pg.nom!.toLowerCase())),
                "g",
              ),
            )
            ?.filter((e) => e != "");
          if (
            (prenomMatch == null || prenomMatch?.length == 0) &&
            (nomMatch == null || nomMatch?.length == 0)
          ) {
            return false;
          }
        }
        return true;
      }).sort((e, i) => i.pg.proms! - e.pg.proms!);

      if (selected != "Tout") break;
    case "Fams":
      if (searchText == "" && selected == "Fams") {
        searchItems.Fams = dataToSort.SearchFams;
        break;
      }
      searchItems.Fams = dataToSort.SearchFams.filter((e) => {
        const t = [...sT.matchAll(e.regex)].map((e) => e[0]);
        return t.length >= l;
      });
      if (selected != "Tout") break;
    case "Boquette":
      if (searchText == "" && selected == "Boquette") {
        searchItems.Boquette = dataToSort.SearchBoquettes;
        break;
      }
      searchItems.Boquette = dataToSort.SearchBoquettes.filter((e) => {
        const t = [...sT.matchAll(e.regex)]
          .map((e) => e[0])
          .filter((e) => e != "");
        return t.length >= l;
      });
      break;
  }
  searchItems.Tout = [
    ...searchItems.PG,
    ...searchItems.Boquette,
    ...searchItems.Fams,
  ] as any;
  return searchItems;
}
