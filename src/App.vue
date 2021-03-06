<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/training">
            <v-list-item-action>
              <v-icon>mdi-dumbbell</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Training</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/gsp-tracker">
            <v-list-item-action>
              <v-icon>mdi-trending-up</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>GSP Tracker</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/stats">
            <v-list-item-action>
              <v-icon>mdi-poll-box</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Stats</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-action>
              <v-icon>mdi-information</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="headline">
        <router-link class="grey--text text--lighten-5" to="/">
          Smash Training
        </router-link>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row align="center" justify="center">
          <v-col :cols="12" :sm="8" :md="8">
            <keep-alive include="training">
              <router-view :key="$route.fullPath" />
            </keep-alive>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-snackbar v-model="snackbarEnabled" :timeout="timeout">
      {{ snackbarText }}
      <v-btn color="blue" text @click="snackbarEnabled = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  commitDrawer,
  commitSnackbarText,
  dispatchRestoreState,
  dispatchSaveState,
  readDrawer,
  readSnackbarText,
} from "./store";

const SMALL_TIMEOUT = 1250;
const LARGE_TIMEOUT = 3000;

@Component({ name: "App" })
export default class extends Vue {
  private snackbarEnabled: boolean = false;
  private snackbarText: string = "";
  private drawer: boolean = false;
  private seenSnackbarTexts: { [x in string]: boolean } = {};
  private timeout: number = SMALL_TIMEOUT;

  public created() {
    this.$watch(() => this.snackbarEnabled, function(snackbarEnabled) {
      if (!snackbarEnabled) {
        commitSnackbarText(this.$store, null);
      }
    });
    this.$watch(() => readSnackbarText(this.$store), function(snackbarText) {
      if (snackbarText !== null) {
        this.snackbarEnabled = true;
        this.snackbarText = snackbarText;

        if (this.seenSnackbarTexts[snackbarText]) {
          this.timeout = SMALL_TIMEOUT;
        } else {
          this.timeout = LARGE_TIMEOUT;
        }
        this.seenSnackbarTexts[snackbarText] = true;
      } else {
        this.snackbarEnabled = false;
        this.snackbarText = "";
      }
    });

    this.$watch(() => this.drawer, function(drawer) {
      commitDrawer(this.$store, drawer);
    });
    this.$watch(() => readDrawer(this.$store), function(drawer) {
      this.drawer = drawer;
    });
  }

  public async mounted() {
    await dispatchRestoreState(this.$store);
  }
}
</script>
