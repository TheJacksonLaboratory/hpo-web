package hpo.api

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses

@Api(value = "/api/hpo", tags = ["Gene"], description = "Gene Details API")
class HpoGeneDetailsController {
  HpoGeneDetailsService hpoGeneDetailsService
	static responseFormats = ['json', 'xml']

  @ApiOperation(
    value = "Get gene details ( disease and term associations ) by entrez Id",
    nickname = "gene/{entrezId}",
    produces = "application/json",
    httpMethod = "GET"
  )
  @ApiResponses([
    @ApiResponse(code = 404, message = "Something was wrong with the request")]
  )
  @ApiImplicitParams([
    @ApiImplicitParam(name = "entrezId",
      paramType = "path",
      required = true,
      value = "gene entrez id",
      example = "2200",
      dataType = "integer")])
  def searchGene(Integer id){
    def res = hpoGeneDetailsService.searchGene(id)
    if(res.gene != ''){
      render(view: 'searchGene', model: [resultMap: res])
    }else {
      render(view: '/notFound')
    }
  }
}
