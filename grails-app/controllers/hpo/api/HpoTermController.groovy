package hpo.api

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.monarchinitiative.phenol.ontology.data.TermId

@Api(value = "/api/hpo", tags = ["Term"], description = "Term API")
class HpoTermController {
  HpoTermService hpoTermService
  HpoTermRelationsService hpoTermRelationsService
  HpoLoincService hpoLoincService
	static responseFormats = ['json']

  /**
   * @param Trimmed Rest id From Url
   * @return
   *
   */

    @ApiOperation(
      value = "Get hpo term details by ontology id.",
      nickname = "term/{ontologyId}",
      produces = "application/json",
      httpMethod = "GET"
    )
    @ApiResponses([
      @ApiResponse(code = 404, message = "Something was wrong with the request")]
    )
    @ApiImplicitParams([
      @ApiImplicitParam(name = "ontologyId",
        paramType = "path",
        required = true,
        value = "hpo id",
        dataType = "string",
        example="HP:0001166")])
    def searchTerm(){
      def res = hpoTermService.searchTerm(params.id.trim())
      if(res){
        render(view: '/hpoTermDetails/searchTerm', model: [result: res])
      } else {
        render(view: '/notFound')
      }
    }

    @ApiOperation(
      value = "Get gene associations for a specific term",
      nickname = "term/{ontologyId}/genes",
      produces = "application/json",
      httpMethod = "GET"
    )
    @ApiResponses([
      @ApiResponse(code = 404, message = "Method Not Found. (Typically means we couldn't find the Id")]
    )
    @ApiImplicitParams([
      @ApiImplicitParam(name = "ontologyId",
        paramType = "path",
        required = true,
        value = "term ontology id",
        example = "HP:0001166",
        dataType = "string")])
    def searchGenesByTerm(Integer offset, Integer max){
      if (!offset) offset = 0
      if (!max)  max = 20
      def res = hpoTermService.searchGenesByTerm(params.id.trim(), offset, max)
      if(res){
        render(view: '/hpoGeneDetails/searchGenesByTerm', model: [resultMap: res ])
      } else {
        render(view: '/notFound')

      }
    }

    @ApiOperation(
      value = "Get disease associations for a specific term",
      nickname = "term/{ontologyId}/diseases",
      produces = "application/json",
      httpMethod = "GET"
    )
    @ApiResponses([
      @ApiResponse(code = 404, message = "Method Not Found. (Typically means we couldn't find the Id")]
    )
    @ApiImplicitParams([
      @ApiImplicitParam(name = "ontologyId",
        paramType = "path",
        required = true,
        value = "term ontology id",
        example = "HP:0001166",
        dataType = "string")])
    def searchDiseasesByTerm(Integer offset, Integer max){
      if (!offset) offset = 0
      if (!max)  max = 20
      def res = hpoTermService.searchDiseasesByTerm(params.id.trim(), offset, max)
      if(res){
        render(view: '/hpoDiseaseDetails/searchDiseasesByTerm', model: [resultMap: hpoTermService.searchDiseasesByTerm(params.id.trim(), offset, max)])
      } else {
        render(view: '/notFound')
      }
    }

  def searchLoincByTerm(String id){
    render(view: '/hpoLoinc/loinc', model: [entryList: hpoLoincService.searchByHpo(TermId.of(id)).toList()])
  }
}
