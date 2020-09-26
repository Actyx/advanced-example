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

echo "Reset Demo kit"
echo ""

if [ $# -ne 1 ]; then
  echo "Missing parameter for topic prefix (actyx-demo-   )"
  echo "Example: ./resetDemo.sh 12"
  exit -1
fi

newTopic=actyx-demo-$1

# param 1 ip
stop_all_apps() {
  ax -j apps ls --local $1 | jq .result[].appId -r | while read line; do
    echo "  stop $line"
    ax -j apps stop $line --local $1>/dev/null
  done

  wait_for_stopped $1
}
# param 1 ip
undeploy_all_apps() {
  stop_all_apps $1
  ax -j apps ls --local $1 | jq .result[].appId -r | while read line; do
    echo "  stop $line"
    ax -j apps undeploy $line --local $1>/dev/null
  done
}
# param 1 ip
wait_for_stopped() {
  echo "  waiting till all apps are stopped"
  while [ true ] ; do
    if [ -z "$(ax apps ls --local $1 | grep RUNNING)" ]; then
      break
    else
      sleep 1
    fi
  done
  echo "  all apps are stopped"
      sleep 2
}
# param 1 ip
# param 2 topic
update_topic () {
  stop_all_apps $1
  ax settings set com.actyx.os/services/eventService/topic $2 --local $1 >/dev/null
}

echo "Update Demo-Kit to new topic: $newTopic"
echo "Please check if all devices are switched on and connected"
echo "confirm with any key"
read -n 1
echo ""
echo "Change topic of machine 2 first"
update_topic 192.168.0.105 $newTopic
echo "Machine 2 start application (machine)"
ax apps start machine --local 192.168.0.105
echo "Machine 2 done"
echo ""
echo "IMPORTANT: Disconnect Machine 2 now from the network"
while timeout 1 ping -c 1 -n 192.168.0.103 &> /dev/null; do
  sleep 1
  printf "."
done

echo ""
echo ""
echo "Change topic of table 1"
update_topic 192.168.0.100 $newTopic
echo "  done"
echo ""
echo "Change topic of table 1"
update_topic 192.168.0.102 $newTopic
echo "  done"
echo ""
echo "Change topic of smart phone"
undeploy_all_apps 192.168.0.101
update_topic 192.168.0.101 $newTopic
echo "  done"

echo "Change topic of Machine 1"
update_topic 192.168.0.103 $newTopic
echo "Machine 1 start application (wago-connector)"
ax apps start wago-connector --local 192.168.0.103
sleep 5
echo "  done"

echo ""
echo ""
echo ""
echo ""
echo "Have fun!!"
