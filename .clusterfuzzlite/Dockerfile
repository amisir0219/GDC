FROM gcr.io/oss-fuzz-base/base-builder:v1       # Base image with clang toolchain
RUN apt-get update && apt-get install -y ...    # Install required packages to build your project.
COPY . $SRC/GDC                      # Copy your project's source code.
WORKDIR $SRC/GDC/.clusterfuzzlite                     # Working directory for build.sh.
COPY ./.clusterfuzzlite/build.sh $SRC/           # Copy build.sh into $SRC dir.
