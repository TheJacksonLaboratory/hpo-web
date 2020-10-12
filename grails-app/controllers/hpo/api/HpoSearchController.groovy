package hpo.api
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses


@Api(value = "/api/hpo", tags = ["Search"], description = "Search API")
class HpoSearchController {
  static responseFormats = ['json']

  SearchService searchService

  @ApiOperation(
    value = "Search terms, diseases or genes",
    nickname = "search/?q={query}",
    produces = "application/json",
    httpMethod = "GET"
  )
  @ApiResponses([
    @ApiResponse(code = 404, message = "Something was wrong with the request")]
  )
  @ApiImplicitParams([
    @ApiImplicitParam(name = "query",
      paramType = "path",
      required = true,
      example = "arach",
      dataType = "string")])
  def searchAll(String q, boolean fetchAll){

    if (fetchAll){
      render(view: 'searchAll', model: [resultMap: searchService.searchAll(q, 0, -1)])
    }else{
      render(view: 'searchAll', model: [resultMap: searchService.searchAll(q)])
    }
  }
}
