package hpo.api.models

import com.github.phenomics.ontolib.base.OntoLibRuntimeException
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.ontology.data.TermAnnotation
import com.google.common.collect.ComparisonChain

public final class HpoGeneDiseaseAnnotation {

  /** Id in disease database **/
  private final String diseaseId;
  private final String geneSymbol;
  private final Integer geneId;

  public HpoGeneDiseaseAnnotation(Integer geneId, String geneSymbol, String diseaseId) {
    this.geneId = geneId;
    this.geneSymbol = geneSymbol;
    this.diseaseId = diseaseId;

  }

  /**
   * @return DiseaseId, e.g., <code>OMIM:614036</code>;
   */
  public String getDiseaseId(){
    return diseaseId;
  }
  /**
   * @return DiseaseId, e.g., <code>TP53</code>;
   */
  public String getGeneSymbol(){
    return geneSymbol;
  }
  /**
   * @return DiseaseId, e.g., <code>7157</code>;
   */
  public Integer getGeneId(){
    return geneId
  }

  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (getClass() != obj.getClass()) {
      return false;
    }
    HpoGeneDiseaseAnnotation other = (HpoGeneDiseaseAnnotation) obj;
    if (diseaseId == null) {
      if (other.diseaseId != null) {
        return false;
      }
    } else if (!diseaseId.equals(other.diseaseId)) {
      return false;
    }
    if (geneSymbol == null) {
      if (other.geneSymbol != null) {
        return false;
      }
    } else if (!geneSymbol.equals(other.geneSymbol)) {
      return false;
    }
    if (geneId == null) {
      if (other.geneId != null) {
        return false;
      }
    } else if (!geneId.equals(other.geneId)) {
      return false;
    }
    return true;
  }
}

