// eslint-disable
// this is an auto generated file. This will be overwritten

export const getSdg = `query GetSdg($id: ID!) {
  getSDG(id: $id) {
    id
    goal
    owner
    certifies
  }
}
`;
export const listSdGs = `query ListSdGs($filter: ModelSDGFilterInput, $limit: Int, $nextToken: String) {
  listSDGs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      goal
      owner
      certifies
    }
    nextToken
  }
}
`;
