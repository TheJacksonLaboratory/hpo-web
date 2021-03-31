package hpo.api
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses


@Api(value = "/api/hpo", tags = ["Search"])
class HpoSearchController {
  static responseFormats = ['json']

  SearchService searchService
  HpoTermRelationsService hpoTermRelationsService

  @ApiOperation(
    value = "Search terms, diseases and genes",
    nickname = "search/?q={query}",
    produces = "application/json",
    httpMethod = "GET"
  )
  @ApiResponses([
    @ApiResponse(code = 404, message = "Something was wrong with the request")]
  )
  @ApiImplicitParams([
    @ApiImplicitParam(name = "q",
      paramType = "query",
      required = true,
      example = "arach",
      dataType = "string",
      value = "a search string"),
    @ApiImplicitParam(name = "max",
      paramType = "query", required = false, value = "an upper limit for docs to return. (-1 for all) ",
      defaultValue = "10", example = "-1", dataType = "integer"),
    @ApiImplicitParam(name = "offset", paramType = "query",  required = false, value = "a page when max value is set",
      defaultValue = "0", dataType = "integer"),
    @ApiImplicitParam(name = "category",
      paramType = "query",
      required = false,
      example = "terms",
      dataType = "string",
      value = "filter search down to a category only 'terms', 'genes', or 'diseases'")])
  def searchAll(String q, Integer offset, Integer max, String category){
    if (!offset) offset = 0
    if (!max)  max = 10
    render(view: 'searchAll', model: [resultMap: searchService.searchAll(q, offset, max, category)])
  }

  @ApiOperation(
    value = "Anchor Descendant Search Starting from the given hpo term id",
    nickname = "search/descendants/?s={start}&q={query}",
    produces = "application/json",
    httpMethod = "GET"
  )
  @ApiResponses([
    @ApiResponse(code = 404, message = "Something was wrong with the request")]
  )
  @ApiImplicitParams([
    @ApiImplicitParam(name = "s",
      paramType = "query",
      required = true,
      example = "HP:0003674",
      dataType = "string",
      value = "the starting term to search from"),
    @ApiImplicitParam(name = "q",
      paramType = "query",
      required = true,
      example = "juvenile",
      dataType = "string",
      value = "a search string to look for")
  ])
  def descendantSearch(String s, String q){
      def list = hpoTermRelationsService.findAllDescendants(s, q)
      render(view: '/hpoSearch/descendants', model: [descendantList: list])
  }
}
