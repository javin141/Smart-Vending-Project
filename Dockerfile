FROM benchpilot/raspbian-picamera2
WORKDIR /app
COPY . .
#RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN pip3 install -r src/requirements.txt
WORKDIR /coretools



RUN echo $(uname -m)
RUN dpkg --add-architecture armhf
RUN dpkg --add-architecture arm64


WORKDIR /app/SPI-Py-master
RUN python3 setup.py install

WORKDIR /app
RUN apt install -y libzbar0
WORKDIR /app/src

RUN chmod +x MachV2.sh

CMD ./MachV2.sh