#!/usr/bin/env python3
import dbus
import dbus.service
import dbus.mainloop.glib
from gi.repository import GLib

dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
loop = GLib.MainLoop()
MPRIS_PATH = "/org/mpris/MediaPlayer2"

class DummyPlayer(dbus.service.Object):
    def __init__(self, bus, name):
        super().__init__(bus, MPRIS_PATH)

    @dbus.service.method("org.freedesktop.DBus.Properties",
                         in_signature="ss", out_signature="v")
    def Get(self, interface, prop):
        if interface == "org.mpris.MediaPlayer2":
            if prop == "Identity":
                return "DummyPlayer"
            elif prop == "CanQuit":
                return False
            elif prop == "CanRaise":
                return False
            elif prop == "HasTrackList":
                return False
        elif interface == "org.mpris.MediaPlayer2.Player":
            if prop == "PlaybackStatus":
                return "Stopped"
            elif prop in ["CanControl", "CanPlay", "CanPause", "CanSeek",
                          "CanGoNext", "CanGoPrevious"]:
                return False
            elif prop == "Metadata":
                return dbus.Dictionary({}, signature='sv')
            elif prop == "Position":
                return dbus.Int64(0)
        raise Exception(f"Unknown property {interface}.{prop}")

    @dbus.service.method("org.freedesktop.DBus.Properties",
                         in_signature="s", out_signature="a{sv}")
    def GetAll(self, interface):
        props = {}
        if interface == "org.mpris.MediaPlayer2":
            props.update({
                "Identity": "DummyPlayer",
                "CanQuit": False,
                "CanRaise": False,
                "HasTrackList": False
            })
        elif interface == "org.mpris.MediaPlayer2.Player":
            props.update({
                "PlaybackStatus": "Stopped",
                "CanControl": False,
                "CanPlay": False,
                "CanPause": False,
                "CanSeek": False,
                "CanGoNext": False,
                "CanGoPrevious": False,
                "Metadata": dbus.Dictionary({}, signature='sv'),
                "Position": dbus.Int64(0)
            })
        return dbus.Dictionary(props, signature='sv')


bus = dbus.SessionBus()
name = dbus.service.BusName("org.mpris.MediaPlayer2.dummyplayer", bus)
player = DummyPlayer(bus, name)
loop.run()
