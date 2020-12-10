package hpo.api

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses

@Api(value = "/api/maxo", tags = ["Search"])
class MaxoSearchController {

  SearchService searchService


  @ApiOperation(
    value = "Search Medical Action Ontology",
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
      example = "therapy",
      dataType = "string")])
  def searchMaxo(String q){
    if(q){
      render(view: 'getMaxoSearchResults', model: [maxoSearchResultList: searchService.searchMaxo(q)])
    } else {
      render("/notFound")
    }
  }
}
