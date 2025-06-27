import SearchSpotDto from "./searchSpotDto";

export default interface SearchSpotDtoPage {
  content: SearchSpotDto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
