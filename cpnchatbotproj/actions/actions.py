# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_answer_web_development"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
# user_message = tracker.latest_message.get("text").lower()

# if "front-end" in user_message:
#     dispatcher.utter_message(
#         text="Front-end development focuses on the user interface and user experience, using technologies like HTML, CSS, and JavaScript.")
# elif "back-end" in user_message:
#     dispatcher.utter_message(
#         text="Back-end development involves server-side logic, databases, and APIs, often using languages like Python, Java, or Node.js.")
# elif "react" in user_message:
#     dispatcher.utter_message(
#         text="React is a JavaScript library for building user interfaces, particularly single-page applications where data changes over time.")
# else:
#     dispatcher.utter_message(
#         text="Web development involves creating websites and applications for the internet. It can be divided into front-end (client-side) and back-end (server-side) development.")
#
# return []



