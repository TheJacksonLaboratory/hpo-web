package hpo.api.term

/**
 * A minimum representation of a LOINC term
 */
class LoincTerm {

  String loincId;
  String longCommonName;
  String scale;

  String getLoincId() {
    return loincId
  }

  void setLoincId(String loincId) {
    this.loincId = loincId
  }

  String getLongCommonName() {
    return longCommonName
  }

  void setLongCommonName(String longCommonName) {
    this.longCommonName = longCommonName
  }

  String getScale() {
    return scale
  }

  void setScale(String scale) {
    this.scale = scale
  }

  String toString(){
    return loincId + "\t" + scale + "\t" + longCommonName
  }
}
