FROM benchpilot/raspbian-picamera2
WORKDIR /app
COPY . .
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN pip3 install -r src/requirements.txt

WORKDIR /coretools
RUN echo $(uname -m)
RUN dpkg --add-architecture armhf
RUN dpkg --add-architecture arm64

RUN apt install -y wget

RUN wget http://mirror.sg.gs/debian/pool/main/d/dbus/libdbus-1-3_1.14.8-2_arm64.deb
RUN wget http://mirror.sg.gs/debian/pool/main/libj/libjpeg-turbo/libjpeg62-turbo_2.1.5-2_arm64.deb
RUN wget http://mirror.sg.gs/debian/pool/main/v/v4l-utils/libv4l-0_1.24.1-2_arm64.deb

RUN wget http://mirror.sg.gs/debian/pool/main/z/zbar/libzbar0_0.23.90-1_arm64.deb


RUN apt install -y ./libzbar0_0.23.90-1_arm64.deb
WORKDIR /app
RUN chmod +x src/MachV2.sh

CMD ./src/MachV2.sh