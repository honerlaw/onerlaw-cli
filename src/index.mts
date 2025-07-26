#!/usr/bin/env node

import { Command } from "commander";
import * as commands from "./commands/index.mjs";

// Create the CLI program
const program = new Command();

// Set up the program
program
  .name("@onerlaw/cli")
  .description("Terraform deployment script for Google Cloud infrastructure")
  .version("1.0.0");

Object.values(commands).forEach((command) => {
  command(program);
});

// Parse command line arguments
program.parse(); 