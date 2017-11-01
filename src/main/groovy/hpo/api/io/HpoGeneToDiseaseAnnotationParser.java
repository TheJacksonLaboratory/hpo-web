package hpo.api.io;

import com.github.phenomics.ontolib.io.base.TermAnnotationParserException;
import hpo.api.models.HpoGeneDiseaseAnnotation;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * Parser for "genes to phenotype annotation" files.
 *
 * <p>
 * <b>Usage Example</b>
 * </p>
 *
 * <pre>
 * File inputFile = new File("genes_to_phenotype.txt");
 * try {
 *   HpoGeneTransitiveAnnotationParser parser = new HpoGeneTransitiveAnnotationParser(inputFile);
 *   while (parser.hasNext()) {
 *     HpoGeneAnnotation anno = parser.next();
 *     // ...
 *   }
 * } catch (IOException e) {
 *    e.printStackTrace();
 *    System.err.println("Problem reading from file.");
 * } catch (TermAnnotationParserException e) {
 *    e.printStackTrace();
 *    System.err.println("Problem reading from file.");
 * }
 * </pre>
 *
 * @author <a href="mailto:michael.gargano@jax.org">Michael Gargano</a>
 */
public class HpoGeneToDiseaseAnnotationParser {

  /** Expected header string. */
  private static final String EXPECTED_HEADER =
   "#Format: entrez-gene-id<tab>entrez-gene-symbol<tab>DiseaseId";

  /**
   * The {@link File} to read from.
   */
  private final File file;

  /**
   * The {@link BufferedReader} to use for reading line-wise.
   */
  private final BufferedReader reader;

  /** The next line. */
  private String nextLine;

  /**
   * Create new parser for HPO Phenotype to Genes files.
   *
   * @param file The file to read from.
   *
   * @throws IOException In case of problems with opening and reading from <code>file</code>.
   *
   */
  public HpoGeneToDiseaseAnnotationParser(File file) throws IOException, TermAnnotationParserException {
    this.file = file;
    this.reader = new BufferedReader(new FileReader(file));
    this.nextLine = reader.readLine();
    checkHeader();
  }

  /**
   * Read first line and check header.
   *
   *
   * @throws IOException If there is a problem with reading from the file.
   */
  private void checkHeader() throws IOException, TermAnnotationParserException {
    if (!EXPECTED_HEADER.equals(nextLine)) {
      throw new TermAnnotationParserException("First line is not the expected header. \"" + nextLine
        + "\" vs. \"" + EXPECTED_HEADER + "\" (expected)");
    }
    nextLine = reader.readLine();
  }

  public boolean hasNext() {
    return nextLine != null;
  }

  public HpoGeneDiseaseAnnotation next() throws IOException {
    final String[] arr = nextLine.split("\t");
    final int geneId = Integer.parseInt(arr[0]);
    final String geneSymbol = arr[1];
    final String diseaseId = arr[2];
    nextLine = reader.readLine();
    return new HpoGeneDiseaseAnnotation(geneId, geneSymbol, diseaseId);
  }

  public void close() throws IOException {
    reader.close();
  }

  public File getFile() {
    return file;
  }

}
