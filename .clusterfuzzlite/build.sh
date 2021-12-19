# Step 1: Build the project

# Build the project .jar as usual, e.g. using Maven.
mvn package
# In this example, the project is built with Maven, which typically includes the
# project version into the name of the packaged .jar file. The version can be
# obtained as follows:
CURRENT_VERSION=$(mvn org.apache.maven.plugins:maven-help-plugin:3.2.0:evaluate \
-Dexpression=project.version -q -DforceStdout)
# Copy the project .jar into $OUT under a fixed name.
cp "target/sample-project-$CURRENT_VERSION.jar" $OUT/sample-project.jar

# Specify the projects .jar file(s), separated by spaces if there are multiple.
PROJECT_JARS="sample-project.jar"

# Step 2: Build the fuzzers (should not require any changes)

# The classpath at build-time includes the project jars in $OUT as well as the
# Jazzer API.
BUILD_CLASSPATH=$(echo $PROJECT_JARS | xargs printf -- "$OUT/%s:"):$JAZZER_API_PATH

# All .jar and .class files lie in the same directory as the fuzzer at runtime.
RUNTIME_CLASSPATH=$(echo $PROJECT_JARS | xargs printf -- "\$this_dir/%s:"):\$this_dir

for fuzzer in $(find $SRC -name '*Fuzzer.java'); do
  fuzzer_basename=$(basename -s .java $fuzzer)
  javac -cp $BUILD_CLASSPATH $fuzzer
  cp $SRC/$fuzzer_basename.class $OUT/

  # Create an execution wrapper that executes Jazzer with the correct arguments.
  echo "#!/bin/sh
# LLVMFuzzerTestOneInput for fuzzer detection.
this_dir=\$(dirname \"\$0\")
LD_LIBRARY_PATH=\"$JVM_LD_LIBRARY_PATH\":\$this_dir \
\$this_dir/jazzer_driver --agent_path=\$this_dir/jazzer_agent_deploy.jar \
--cp=$RUNTIME_CLASSPATH \
--target_class=$fuzzer_basename \
--jvm_args=\"-Xmx2048m:-Djava.awt.headless=true\" \
\$@" > $OUT/$fuzzer_basename
  chmod +x $OUT/$fuzzer_basename
done
The java-example project contains an example of a build.sh for Java projects with native libraries.

FuzzedDataProvider
Jazzer provides a FuzzedDataProvider that can simplify the task of creating a fuzz target by translating the raw input bytes received from the fuzzer into useful primitive Java types. Its functionality is similar to FuzzedDataProviders available in other languages, such as Python and C++.

On OSS-Fuzz, the required library is available in the base docker images under the path $JAZZER_API_PATH, which is added to the classpath by the example build script shown above. Locally, the library can be obtained from Maven Central.

A fuzz target using the FuzzedDataProvider would look as follows:

import com.code_intelligence.jazzer.api.FuzzedDataProvider;

public class ExampleFuzzer {
    public static void fuzzerTestOneInput(FuzzedDataProvider data) {
        int number = data.consumeInt();
        String string = data.consumeRemainingAsString();
        // ...
    }
}
