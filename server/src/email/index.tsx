/// <reference path="../types.d.ts" />

import * as React from 'react';
import Oy from 'oy-vey';

import { StatusEmail, StatusEmailProps } from './StatusEmail';
import { HtmlEmail, HtmlEmailProps } from './HtmlEmail';
import { AppConfig } from '../config';

interface EmailArgs {
  title: string;
  previewText: string;
}

export function getStatusEmailHtml(args: EmailArgs & StatusEmailProps) {
  const baseUrl = AppConfig.BaseUrl;

  const { title, previewText, ...templateArgs } = args;

  const template = Oy.renderTemplate(<StatusEmail baseUrl={baseUrl} {...templateArgs} />, {
    title,
    previewText,
  });

  return template;
}

export function getHtmlEmailHtml(args: EmailArgs & HtmlEmailProps) {
  const baseUrl = AppConfig.BaseUrl;

  const { title, previewText, ...templateArgs } = args;

  const template = Oy.renderTemplate(<HtmlEmail baseUrl={baseUrl} {...templateArgs} />, {
    title,
    previewText,
  });

  return template;
}
