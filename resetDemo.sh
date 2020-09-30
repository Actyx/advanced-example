#!/bin/bash
#
# Reset demo kit.
# Reset the machine 2 first and requires a disconnect
# After that it will change the topic of
#  192.168.0.100 tablet 1
#  192.168.0.102 tablet 2
#  192.168.0.101 smartphone
#
# it will also undeploy all apps from the smartphone
#
# finally it change the topic of machine 1 (192.168.0.103)
# and starts/enables the app again
#
# Any questions (contact me (Alex))

printf "Reset Demo kit\n\n"

if [ $# -ne 1 ]; then
  printf "Missing parameter for topic prefix (actyx-demo-   )\n"
  printf "Example: \e[37m./resetDemo.sh 12\e[0m\n"
  exit -1
fi

newTopic=actyx-demo-$1

# param 1 ip
stop_all_apps() {
  printf "  stop"
  ax -j apps ls --local $1 | jq .result[].appId -r | while read line; do
    printf " \e[37m$line\e[0m"
    ax -j apps stop $line --local $1>/dev/null
  done

  printf "\n"
  wait_for_stopped $1
}
# param 1 ip
undeploy_all_apps() {
  stop_all_apps $1
  printf "  undeploy"
  ax -j apps ls --local $1 | jq .result[].appId -r | while read line; do
    printf " \e[37m$line\e[0m"
    ax -j apps undeploy $line --local $1>/dev/null
  done
  printf "\n"
}
# param 1 ip
wait_for_stopped() {
  printf "  waiting till all apps are stopped"
  while [ true ] ; do
    if [ -z "$(ax apps ls --local $1 | grep RUNNING)" ]; then
      break
    else
      sleep 1
    fi
  done
  printf " \e[32mall apps are stopped\e[0m \n"
  sleep 2
}
# param 1 ip
# param 2 topic
update_topic () {
  stop_all_apps $1
  ax settings set com.actyx.os/services/eventService/topic $2 --local $1 >/dev/null
}

# param 1 ip
check_online() {
  while ! timeout 1 ping -c 1 -n $1 &> /dev/null; do
    sleep 1
  done
}

printf "Update Demo-Kit to new topic: \e[32m$newTopic\e[0m\n"
printf "Please check if all devices are switched on and connected\n"
printf "  - check Tablet 1 "
check_online 192.168.0.100
printf "\e[32mavailable\e[0m \n  - check Tablet 2 "
check_online 192.168.0.102
printf "\e[32mavailable\e[0m \n  - check Smartphone "
check_online 192.168.0.101
printf "\e[32mavailable\e[0m \n  - check Machine 1 "
check_online 192.168.0.103
printf "\e[32mavailable\e[0m \n  - check machine 2 "
check_online 192.168.0.105
printf "\e[32mavailable\e[0m \n\n"
printf "Change topic of \e[37machine 2\e[0m first\n"
update_topic 192.168.0.105 $newTopic
printf "Machine 2 start application (machine)\n"
ax apps start machine --local 192.168.0.105
printf "  \e[32mdone\e[0m \n\n"
printf "\e[31mIMPORTANT:\e[0m Disconnect \e[37mMachine 2\e[0m now from the network\n"
while timeout 1 ping -c 1 -n 192.168.0.105 &> /dev/null; do
  sleep 1
  printf "."
done

printf "\n\n\n"
printf "Change topic of \e[37mtable 1\e[0m\n"
update_topic 192.168.0.100 $newTopic
printf "  \e[32mdone\e[0m\n\n"
printf "Change topic of \e[37mtable 2\e[0m\n"
update_topic 192.168.0.102 $newTopic
printf "  \e[32mdone\e[0m\n\n"
printf "Change topic of \e[37msmartphone\e[0m\n"
undeploy_all_apps 192.168.0.101
update_topic 192.168.0.101 $newTopic
printf "  \e[32mdone\e[0m\n\n"

printf "Change topic of \e[37mMachine 1\e[0m\n"
update_topic 192.168.0.103 $newTopic
printf "Machine 1 start application (wago-connector)\n"
ax apps start wago-connector --local 192.168.0.103
sleep 5
printf "  \e[32mdone\e[0m\n\n\n\n\n"

printf "\e[32mHave fun!!\e[0m\n"
